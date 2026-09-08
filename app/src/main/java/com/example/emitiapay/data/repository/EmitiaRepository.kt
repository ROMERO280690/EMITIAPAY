package com.example.emitiapay.data.repository

import com.example.emitiapay.data.local.*
import com.example.emitiapay.data.model.*
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import java.util.UUID

class EmitiaRepository(private val database: AppDatabase) {
    private val accountDao = database.accountDao()
    private val transactionDao = database.transactionDao()
    private val paymentDao = database.paymentDao()
    private val collectionDao = database.collectionDao()
    private val eCheqDao = database.eCheqDao()
    private val cardDao = database.cardDao()
    private val investmentDao = database.investmentDao()
    private val contactDao = database.contactDao()

    companion object {
        const val USD_TO_ARS_RATE = 1250.0
    }

    val accounts: Flow<List<Account>> = accountDao.getAllAccounts().map { list -> list.map { it.toModel() } }
    val transactions: Flow<List<Transaction>> = transactionDao.getAllTransactions().map { list -> list.map { it.toModel() } }
    val payments: Flow<List<PaymentRequest>> = paymentDao.getAllPayments().map { list -> list.map { it.toModel() } }
    val collections: Flow<List<CollectionRequest>> = collectionDao.getAllCollections().map { list -> list.map { it.toModel() } }
    val echeqs: Flow<List<ECheq>> = eCheqDao.getAllECheqs().map { list -> list.map { it.toModel() } }
    val cards: Flow<List<CorporateCard>> = cardDao.getAllCards().map { list -> list.map { it.toModel() } }
    val investments: Flow<List<Investment>> = investmentDao.getAllInvestments().map { list -> list.map { it.toModel() } }
    val contacts: Flow<List<Contact>> = contactDao.getAllContacts().map { list -> list.map { it.toModel() } }

    suspend fun transferOwn(fromId: String, toId: String, amount: Double): Result<Unit> {
        val fromAcc = accountDao.getAccountById(fromId) ?: return Result.failure(Exception("Cuenta de origen no encontrada"))
        val toAcc = accountDao.getAccountById(toId) ?: return Result.failure(Exception("Cuenta de destino no encontrada"))

        if (fromAcc.balance < amount) {
            return Result.failure(Exception("Saldo insuficiente en cuenta origen"))
        }

        val destinationAmount = when {
            fromAcc.currency == "ARS" && toAcc.currency == "USD" -> amount / USD_TO_ARS_RATE
            fromAcc.currency == "USD" && toAcc.currency == "ARS" -> amount * USD_TO_ARS_RATE
            else -> amount
        }

        accountDao.updateBalance(fromId, fromAcc.balance - amount)
        accountDao.updateBalance(toId, toAcc.balance + destinationAmount)

        val tx = TransactionEntity(
            id = "tx_${UUID.randomUUID().toString().take(8)}",
            type = "transfer_out",
            amount = amount,
            currency = fromAcc.currency,
            description = "Transferencia entre cuentas propias (${fromAcc.name} -> ${toAcc.name})",
            counterpartName = toAcc.name,
            counterpartCuit = "",
            category = "transferencias",
            status = "completed",
            accountId = fromId,
            reference = "TRF-${System.currentTimeMillis().toString().takeLast(6)}",
            date = "Hoy"
        )
        transactionDao.insert(tx)

        return Result.success(Unit)
    }

    suspend fun transferThirdParty(fromId: String, contactName: String, contactCuit: String, contactCbu: String, amount: Double, concept: String): Result<Unit> {
        val fromAcc = accountDao.getAccountById(fromId) ?: return Result.failure(Exception("Cuenta de origen no encontrada"))
        if (fromAcc.balance < amount) {
            return Result.failure(Exception("Saldo insuficiente en cuenta origen"))
        }

        accountDao.updateBalance(fromId, fromAcc.balance - amount)

        val tx = TransactionEntity(
            id = "tx_${UUID.randomUUID().toString().take(8)}",
            type = "transfer_out",
            amount = amount,
            currency = fromAcc.currency,
            description = "Transferencia a $contactName - $concept",
            counterpartName = contactName,
            counterpartCuit = contactCuit,
            category = "proveedores",
            status = "completed",
            accountId = fromId,
            reference = "TRF-${System.currentTimeMillis().toString().takeLast(6)}",
            date = "Hoy"
        )
        transactionDao.insert(tx)

        return Result.success(Unit)
    }

    suspend fun createPayment(payment: PaymentRequest) {
        paymentDao.insert(PaymentEntity.fromModel(payment))
    }

    suspend fun approvePayment(id: String, primaryAccountId: String = "acc_1") {
        paymentDao.updateStatus(id, "completed")
        val account = accountDao.getAccountById(primaryAccountId)
        if (account != null) {
            val tx = TransactionEntity(
                id = "tx_${UUID.randomUUID().toString().take(8)}",
                type = "payment",
                amount = 150000.0,
                currency = account.currency,
                description = "Pago de proveedor aprobado",
                counterpartName = "Proveedor",
                counterpartCuit = "",
                category = "proveedores",
                status = "completed",
                accountId = primaryAccountId,
                reference = "PAY-${System.currentTimeMillis().toString().takeLast(6)}",
                date = "Hoy"
            )
            transactionDao.insert(tx)
        }
    }

    suspend fun createCollection(collection: CollectionRequest) {
        collectionDao.insert(CollectionEntity.fromModel(collection))
    }

    suspend fun markCollectionPaid(id: String, amount: Double = 450000.0, primaryAccountId: String = "acc_1") {
        collectionDao.updateStatus(id, "collected")
        val account = accountDao.getAccountById(primaryAccountId)
        if (account != null) {
            accountDao.updateBalance(primaryAccountId, account.balance + amount)
            val tx = TransactionEntity(
                id = "tx_${UUID.randomUUID().toString().take(8)}",
                type = "collection",
                amount = amount,
                currency = account.currency,
                description = "Cobro de factura acreditado",
                counterpartName = "Cliente",
                counterpartCuit = "",
                category = "ventas",
                status = "completed",
                accountId = primaryAccountId,
                reference = "COL-${System.currentTimeMillis().toString().takeLast(6)}",
                date = "Hoy"
            )
            transactionDao.insert(tx)
        }
    }

    suspend fun createECheq(eCheq: ECheq) {
        eCheqDao.insert(ECheqEntity.fromModel(eCheq))
    }

    suspend fun depositECheq(id: String, amount: Double, toAccountId: String = "acc_1") {
        eCheqDao.updateStatus(id, "depositado")
        val account = accountDao.getAccountById(toAccountId)
        if (account != null) {
            accountDao.updateBalance(toAccountId, account.balance + amount)
            val tx = TransactionEntity(
                id = "tx_${UUID.randomUUID().toString().take(8)}",
                type = "deposit",
                amount = amount,
                currency = account.currency,
                description = "Depósito de eCheq acreditado",
                counterpartName = "Cámara Compensadora",
                counterpartCuit = "",
                category = "echeqs",
                status = "completed",
                accountId = toAccountId,
                reference = "ECH-${System.currentTimeMillis().toString().takeLast(6)}",
                date = "Hoy"
            )
            transactionDao.insert(tx)
        }
    }

    suspend fun createCard(card: CorporateCard) {
        cardDao.insert(CardEntity.fromModel(card))
    }

    suspend fun toggleCardFreeze(id: String, currentStatus: String) {
        val newStatus = if (currentStatus == "active") "frozen" else "active"
        cardDao.updateStatus(id, newStatus)
    }

    suspend fun createInvestment(type: String, title: String, amount: Double, tna: Double, durationDays: Int, fromAccountId: String): Result<Unit> {
        val account = accountDao.getAccountById(fromAccountId) ?: return Result.failure(Exception("Cuenta no encontrada"))
        if (account.balance < amount) {
            return Result.failure(Exception("Saldo insuficiente"))
        }

        accountDao.updateBalance(fromAccountId, account.balance - amount)
        val estimatedYield = (amount * tna * durationDays) / 365.0

        val inv = InvestmentEntity(
            id = "inv_${UUID.randomUUID().toString().take(8)}",
            type = type,
            title = title,
            amount = amount,
            currency = account.currency,
            tna = tna,
            durationDays = durationDays,
            estimatedYield = estimatedYield,
            status = "active"
        )
        investmentDao.insert(inv)

        val tx = TransactionEntity(
            id = "tx_${UUID.randomUUID().toString().take(8)}",
            type = "transfer_out",
            amount = amount,
            currency = account.currency,
            description = "Suscripción Inversión: $title",
            counterpartName = "Mercado de Capitales",
            counterpartCuit = "",
            category = "inversiones",
            status = "completed",
            accountId = fromAccountId,
            reference = "INV-${System.currentTimeMillis().toString().takeLast(6)}",
            date = "Hoy"
        )
        transactionDao.insert(tx)

        return Result.success(Unit)
    }
}

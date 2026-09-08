package com.example.emitiapay.data.local

import androidx.room.Entity
import androidx.room.PrimaryKey
import com.example.emitiapay.data.model.*

@Entity(tableName = "accounts")
data class AccountEntity(
    @PrimaryKey val id: String,
    val name: String,
    val currency: String,
    val balance: Double,
    val cbu: String,
    val alias: String,
    val accountType: String,
    val status: String
) {
    fun toModel() = Account(id, name, currency, balance, cbu, alias, accountType, status)
    companion object {
        fun fromModel(m: Account) = AccountEntity(m.id, m.name, m.currency, m.balance, m.cbu, m.alias, m.accountType, m.status)
    }
}

@Entity(tableName = "transactions")
data class TransactionEntity(
    @PrimaryKey val id: String,
    val type: String,
    val amount: Double,
    val currency: String,
    val description: String,
    val counterpartName: String,
    val counterpartCuit: String,
    val category: String,
    val status: String,
    val accountId: String,
    val reference: String,
    val date: String
) {
    fun toModel() = Transaction(id, type, amount, currency, description, counterpartName, counterpartCuit, category, status, accountId, reference, date)
    companion object {
        fun fromModel(m: Transaction) = TransactionEntity(m.id, m.type, m.amount, m.currency, m.description, m.counterpartName, m.counterpartCuit, m.category, m.status, m.accountId, m.reference, m.date)
    }
}

@Entity(tableName = "payments")
data class PaymentEntity(
    @PrimaryKey val id: String,
    val contactName: String,
    val contactCuit: String,
    val contactCbu: String,
    val amount: Double,
    val currency: String,
    val concept: String,
    val category: String,
    val scheduledDate: String,
    val status: String
) {
    fun toModel() = PaymentRequest(id, contactName, contactCuit, contactCbu, amount, currency, concept, category, scheduledDate, status)
    companion object {
        fun fromModel(m: PaymentRequest) = PaymentEntity(m.id, m.contactName, m.contactCuit, m.contactCbu, m.amount, m.currency, m.concept, m.category, m.scheduledDate, m.status)
    }
}

@Entity(tableName = "collections")
data class CollectionEntity(
    @PrimaryKey val id: String,
    val clientName: String,
    val clientEmail: String,
    val amount: Double,
    val currency: String,
    val concept: String,
    val invoiceNumber: String,
    val dueDate: String,
    val status: String
) {
    fun toModel() = CollectionRequest(id, clientName, clientEmail, amount, currency, concept, invoiceNumber, dueDate, status)
    companion object {
        fun fromModel(m: CollectionRequest) = CollectionEntity(m.id, m.clientName, m.clientEmail, m.amount, m.currency, m.concept, m.invoiceNumber, m.dueDate, m.status)
    }
}

@Entity(tableName = "echeqs")
data class ECheqEntity(
    @PrimaryKey val id: String,
    val chequeNumber: String,
    val amount: Double,
    val currency: String,
    val recipientName: String,
    val recipientCuit: String,
    val concept: String,
    val emissionDate: String,
    val dueDate: String,
    val status: String
) {
    fun toModel() = ECheq(id, chequeNumber, amount, currency, recipientName, recipientCuit, concept, emissionDate, dueDate, status)
    companion object {
        fun fromModel(m: ECheq) = ECheqEntity(m.id, m.chequeNumber, m.amount, m.currency, m.recipientName, m.recipientCuit, m.concept, m.emissionDate, m.dueDate, m.status)
    }
}

@Entity(tableName = "investments")
data class InvestmentEntity(
    @PrimaryKey val id: String,
    val type: String,
    val title: String,
    val amount: Double,
    val currency: String,
    val tna: Double,
    val durationDays: Int,
    val estimatedYield: Double,
    val status: String
) {
    fun toModel() = Investment(id, type, title, amount, currency, tna, durationDays, estimatedYield, status)
    companion object {
        fun fromModel(m: Investment) = InvestmentEntity(m.id, m.type, m.title, m.amount, m.currency, m.tna, m.durationDays, m.estimatedYield, m.status)
    }
}

@Entity(tableName = "cards")
data class CardEntity(
    @PrimaryKey val id: String,
    val holderName: String,
    val cardNumberMasked: String,
    val cardType: String,
    val variant: String,
    val currency: String,
    val monthlyLimit: Double,
    val spentAmount: Double,
    val status: String,
    val expiryDate: String,
    val cvv: String
) {
    fun toModel() = CorporateCard(id, holderName, cardNumberMasked, cardType, variant, currency, monthlyLimit, spentAmount, status, expiryDate, cvv)
    companion object {
        fun fromModel(m: CorporateCard) = CardEntity(m.id, m.holderName, m.cardNumberMasked, m.cardType, m.variant, m.currency, m.monthlyLimit, m.spentAmount, m.status, m.expiryDate, m.cvv)
    }
}

@Entity(tableName = "contacts")
data class ContactEntity(
    @PrimaryKey val id: String,
    val name: String,
    val cuit: String,
    val cbu: String,
    val alias: String,
    val bank: String,
    val email: String,
    val category: String
) {
    fun toModel() = Contact(id, name, cuit, cbu, alias, bank, email, category)
    companion object {
        fun fromModel(m: Contact) = ContactEntity(m.id, m.name, m.cuit, m.cbu, m.alias, m.bank, m.email, m.category)
    }
}

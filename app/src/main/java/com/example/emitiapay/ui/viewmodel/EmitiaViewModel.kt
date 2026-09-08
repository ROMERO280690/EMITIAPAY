package com.example.emitiapay.ui.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.emitiapay.data.local.AppDatabase
import com.example.emitiapay.data.model.*
import com.example.emitiapay.data.repository.EmitiaRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import java.text.NumberFormat
import java.util.Locale
import java.util.UUID

data class UserProfile(
    val name: String = "Noa",
    val email: String = "noacvys@gmail.com",
    val role: String = "Director General & Tesorería",
    val cuit: String = "20-38491024-3",
    val avatarInitials: String = "N",
    val isGoogleAuth: Boolean = true,
    val company: String = "EMITIA S.A."
)

data class EmitiaUiState(
    val selectedTab: String = "dashboard",
    val message: String? = null,
    val isError: Boolean = false,
    val isAuthenticated: Boolean = false,
    val currentUser: UserProfile = UserProfile()
)

class EmitiaViewModel(application: Application) : AndroidViewModel(application) {
    private val repository: EmitiaRepository

    init {
        val db = AppDatabase.getDatabase(application)
        repository = EmitiaRepository(db)
    }

    private val _uiState = MutableStateFlow(EmitiaUiState())
    val uiState: StateFlow<EmitiaUiState> = _uiState.asStateFlow()

    val accounts: StateFlow<List<Account>> = repository.accounts
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val transactions: StateFlow<List<Transaction>> = repository.transactions
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val payments: StateFlow<List<PaymentRequest>> = repository.payments
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val collections: StateFlow<List<CollectionRequest>> = repository.collections
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val echeqs: StateFlow<List<ECheq>> = repository.echeqs
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val cards: StateFlow<List<CorporateCard>> = repository.cards
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val investments: StateFlow<List<Investment>> = repository.investments
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val contacts: StateFlow<List<Contact>> = repository.contacts
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val totalBalanceArs = accounts.combine(MutableStateFlow(Unit)) { accs, _ ->
        accs.filter { it.currency == "ARS" }.sumOf { it.balance }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 7500000.0)

    val totalBalanceUsd = accounts.combine(MutableStateFlow(Unit)) { accs, _ ->
        accs.filter { it.currency == "USD" }.sumOf { it.balance }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 15000.0)

    fun selectTab(tab: String) {
        _uiState.value = _uiState.value.copy(selectedTab = tab)
    }

    fun loginWithGoogle(name: String = "Noa", email: String = "noacvys@gmail.com") {
        val initials = if (name.isNotBlank()) {
            name.trim().split(" ")
                .filter { it.isNotEmpty() }
                .take(2)
                .map { it.first().uppercase() }
                .joinToString("")
        } else "G"
        _uiState.value = _uiState.value.copy(
            isAuthenticated = true,
            currentUser = UserProfile(
                name = name,
                email = email,
                role = "Director General & Tesorería",
                cuit = "20-38491024-3",
                avatarInitials = if (initials.isNotEmpty()) initials else "N",
                isGoogleAuth = true,
                company = "EMITIA S.A."
            ),
            message = "Sesión iniciada con Google ($email)"
        )
    }

    fun logout() {
        _uiState.value = _uiState.value.copy(
            isAuthenticated = false,
            message = "Has cerrado sesión correctamente"
        )
    }

    fun clearMessage() {
        _uiState.value = _uiState.value.copy(message = null)
    }

    fun showMessage(msg: String, isError: Boolean = false) {
        _uiState.value = _uiState.value.copy(message = msg, isError = isError)
    }

    fun executeTransferOwn(fromId: String, toId: String, amount: Double, onComplete: (Boolean) -> Unit) {
        viewModelScope.launch {
            val result = repository.transferOwn(fromId, toId, amount)
            if (result.isSuccess) {
                showMessage("Transferencia entre cuentas realizada con éxito")
                onComplete(true)
            } else {
                showMessage(result.exceptionOrNull()?.message ?: "Error al transferir", isError = true)
                onComplete(false)
            }
        }
    }

    fun executeTransferThirdParty(
        fromId: String,
        name: String,
        cuit: String,
        cbu: String,
        amount: Double,
        concept: String,
        onComplete: (Boolean) -> Unit
    ) {
        viewModelScope.launch {
            val result = repository.transferThirdParty(fromId, name, cuit, cbu, amount, concept)
            if (result.isSuccess) {
                showMessage("Transferencia enviada a $name por $concept")
                onComplete(true)
            } else {
                showMessage(result.exceptionOrNull()?.message ?: "Error al transferir", isError = true)
                onComplete(false)
            }
        }
    }

    fun approvePayment(paymentId: String) {
        viewModelScope.launch {
            repository.approvePayment(paymentId)
            showMessage("Pago a proveedor aprobado y debitado")
        }
    }

    fun createPayment(name: String, cuit: String, cbu: String, amount: Double, concept: String, category: String, date: String) {
        viewModelScope.launch {
            val p = PaymentRequest(
                id = "pay_${UUID.randomUUID().toString().take(8)}",
                contactName = name,
                contactCuit = cuit,
                contactCbu = cbu,
                amount = amount,
                currency = "ARS",
                concept = concept,
                category = category,
                scheduledDate = date,
                status = "scheduled"
            )
            repository.createPayment(p)
            showMessage("Pago programado creado exitosamente")
        }
    }

    fun markCollectionCollected(collectionId: String, amount: Double) {
        viewModelScope.launch {
            repository.markCollectionPaid(collectionId, amount)
            showMessage("Cobro registrado y acreditado en cuenta")
        }
    }

    fun createCollection(clientName: String, email: String, amount: Double, concept: String, invoice: String, dueDate: String) {
        viewModelScope.launch {
            val col = CollectionRequest(
                id = "col_${UUID.randomUUID().toString().take(8)}",
                clientName = clientName,
                clientEmail = email,
                amount = amount,
                currency = "ARS",
                concept = concept,
                invoiceNumber = invoice,
                dueDate = dueDate,
                status = "pending"
            )
            repository.createCollection(col)
            showMessage("Solicitud de cobro enviada a $clientName")
        }
    }

    fun depositECheq(eCheqId: String, amount: Double, accountId: String) {
        viewModelScope.launch {
            repository.depositECheq(eCheqId, amount, accountId)
            showMessage("eCheq depositado y acreditado")
        }
    }

    fun createECheq(recipient: String, cuit: String, amount: Double, concept: String, dueDate: String) {
        viewModelScope.launch {
            val ech = ECheq(
                id = "ech_${UUID.randomUUID().toString().take(8)}",
                chequeNumber = "ECH-000${(10000..99999).random()}",
                amount = amount,
                currency = "ARS",
                recipientName = recipient,
                recipientCuit = cuit,
                concept = concept,
                emissionDate = "Hoy",
                dueDate = dueDate,
                status = "emitido"
            )
            repository.createECheq(ech)
            showMessage("eCheq $recipient emitido con éxito")
        }
    }

    fun toggleCardFreeze(cardId: String, currentStatus: String) {
        viewModelScope.launch {
            repository.toggleCardFreeze(cardId, currentStatus)
            val action = if (currentStatus == "active") "congelada" else "reactivada"
            showMessage("Tarjeta $action correctamente")
        }
    }

    fun createCard(holderName: String, cardType: String, variant: String, currency: String, limit: Double) {
        viewModelScope.launch {
            val card = CorporateCard(
                id = "card_${UUID.randomUUID().toString().take(8)}",
                holderName = holderName.uppercase(),
                cardNumberMasked = "•••• •••• •••• ${(1000..9999).random()}",
                cardType = cardType,
                variant = variant,
                currency = currency,
                monthlyLimit = limit,
                spentAmount = 0.0,
                status = "active",
                expiryDate = "0${(1..9).random()}/29",
                cvv = "${(100..999).random()}"
            )
            repository.createCard(card)
            showMessage("Nueva tarjeta corporativa emitida para $holderName")
        }
    }

    fun constituteInvestment(type: String, title: String, amount: Double, tna: Double, days: Int, accountId: String, onComplete: (Boolean) -> Unit) {
        viewModelScope.launch {
            val result = repository.createInvestment(type, title, amount, tna, days, accountId)
            if (result.isSuccess) {
                showMessage("Inversión constituida exitosamente en $title")
                onComplete(true)
            } else {
                showMessage(result.exceptionOrNull()?.message ?: "Error al invertir", isError = true)
                onComplete(false)
            }
        }
    }

    companion object {
        fun formatMoney(amount: Double, currency: String = "ARS"): String {
            val formatter = NumberFormat.getCurrencyInstance(Locale("es", "AR"))
            val formatted = formatter.format(amount)
            return if (currency == "USD") "US$ " + formatted.replace("$", "").trim() else formatted
        }
    }
}

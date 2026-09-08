package com.example.emitiapay.data.model

data class Account(
    val id: String,
    val name: String,
    val currency: String,
    val balance: Double,
    val cbu: String,
    val alias: String,
    val accountType: String,
    val status: String = "active"
)

data class Transaction(
    val id: String,
    val type: String, // transfer_in, transfer_out, payment, collection, yield, deposit
    val amount: Double,
    val currency: String,
    val description: String,
    val counterpartName: String = "",
    val counterpartCuit: String = "",
    val category: String = "general",
    val status: String = "completed",
    val accountId: String = "",
    val reference: String = "",
    val date: String = ""
)

data class PaymentRequest(
    val id: String,
    val contactName: String,
    val contactCuit: String,
    val contactCbu: String,
    val amount: Double,
    val currency: String,
    val concept: String,
    val category: String = "proveedores",
    val scheduledDate: String = "",
    val status: String = "scheduled" // draft, scheduled, completed
)

data class CollectionRequest(
    val id: String,
    val clientName: String,
    val clientEmail: String,
    val amount: Double,
    val currency: String,
    val concept: String,
    val invoiceNumber: String,
    val dueDate: String,
    val status: String = "pending" // pending, sent, collected, overdue
)

data class ECheq(
    val id: String,
    val chequeNumber: String,
    val amount: Double,
    val currency: String,
    val recipientName: String,
    val recipientCuit: String,
    val concept: String,
    val emissionDate: String,
    val dueDate: String,
    val status: String = "emitido" // emitido, pendiente, depositado, rechazado
)

data class Investment(
    val id: String,
    val type: String, // plazo_fijo, fci, bonos, acciones
    val title: String,
    val amount: Double,
    val currency: String,
    val tna: Double,
    val durationDays: Int,
    val estimatedYield: Double,
    val status: String = "active"
)

data class CorporateCard(
    val id: String,
    val holderName: String,
    val cardNumberMasked: String,
    val cardType: String, // virtual, physical
    val variant: String, // debit, credit
    val currency: String,
    val monthlyLimit: Double,
    val spentAmount: Double,
    val status: String = "active", // active, frozen, cancelled
    val expiryDate: String = "12/28",
    val cvv: String = "842"
)

data class Contact(
    val id: String,
    val name: String,
    val cuit: String,
    val cbu: String,
    val alias: String,
    val bank: String = "Banco Galicia",
    val email: String = "",
    val category: String = "proveedores"
)

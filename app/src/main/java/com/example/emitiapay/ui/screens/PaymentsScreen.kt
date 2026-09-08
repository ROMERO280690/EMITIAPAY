package com.example.emitiapay.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.emitiapay.data.model.PaymentRequest
import com.example.emitiapay.ui.theme.*
import com.example.emitiapay.ui.viewmodel.EmitiaViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PaymentsScreen(
    viewModel: EmitiaViewModel
) {
    val payments by viewModel.payments.collectAsState()
    var filterStatus by remember { mutableStateOf("all") }
    var showNewPaymentDialog by remember { mutableStateOf(false) }

    val filteredList = when (filterStatus) {
        "scheduled" -> payments.filter { it.status == "scheduled" }
        "draft" -> payments.filter { it.status == "draft" }
        "completed" -> payments.filter { it.status == "completed" }
        else -> payments
    }

    Scaffold(
        floatingActionButton = {
            FloatingActionButton(
                onClick = { showNewPaymentDialog = true },
                containerColor = IndigoPrimary,
                contentColor = Color.White,
                modifier = Modifier.testTag("fab_new_payment")
            ) {
                Icon(Icons.Default.Add, contentDescription = "Programar Pago")
            }
        },
        containerColor = MaterialTheme.colorScheme.background
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .testTag("payments_screen"),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            item {
                Text(
                    text = "Pagos a Proveedores y Servicios",
                    style = MaterialTheme.typography.titleLarge,
                    color = MaterialTheme.colorScheme.onBackground
                )
                Text(
                    text = "Gestioná la agenda de pagos, aprobaciones y vencimientos",
                    fontSize = 13.sp,
                    color = Slate600
                )
            }

            // Filter Chips
            item {
                LazyRow(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    val filters = listOf(
                        "all" to "Todos",
                        "scheduled" to "Programados",
                        "draft" to "Borradores",
                        "completed" to "Completados"
                    )
                    items(filters) { (key, label) ->
                        FilterChip(
                            selected = filterStatus == key,
                            onClick = { filterStatus = key },
                            label = { Text(label) },
                            colors = FilterChipDefaults.filterChipColors(
                                selectedContainerColor = Color(0xFFEEF2FF),
                                selectedLabelColor = IndigoPrimary
                            )
                        )
                    }
                }
            }

            if (filteredList.isEmpty()) {
                item {
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
                    ) {
                        Box(modifier = Modifier.fillMaxWidth().padding(32.dp), contentAlignment = Alignment.Center) {
                            Text("No hay pagos en esta categoría", color = Slate400, fontSize = 14.sp)
                        }
                    }
                }
            } else {
                items(filteredList) { payment ->
                    PaymentItemCard(
                        payment = payment,
                        onApprove = { viewModel.approvePayment(payment.id) }
                    )
                }
            }
        }
    }

    if (showNewPaymentDialog) {
        NewPaymentDialog(
            onDismiss = { showNewPaymentDialog = false },
            onConfirm = { name, cuit, cbu, amount, concept, cat, date ->
                viewModel.createPayment(name, cuit, cbu, amount, concept, cat, date)
                showNewPaymentDialog = false
            }
        )
    }
}

@Composable
fun PaymentItemCard(
    payment: PaymentRequest,
    onApprove: () -> Unit
) {
    val (statusLabel, statusBg, statusColor) = when (payment.status) {
        "scheduled" -> Triple("Programado", AmberLight, AmberWarning)
        "completed" -> Triple("Completado", EmeraldLight, EmeraldSuccess)
        else -> Triple("Borrador", Slate100, Slate600)
    }

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .testTag("payment_card_${payment.id}"),
        shape = RoundedCornerShape(14.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
    ) {
        Column(
            modifier = Modifier.padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = payment.contactName,
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                    Text(
                        text = "CUIT: ${payment.contactCuit}",
                        fontSize = 12.sp,
                        color = Slate400
                    )
                }
                Surface(
                    shape = RoundedCornerShape(6.dp),
                    color = statusBg
                ) {
                    Text(
                        text = statusLabel,
                        color = statusColor,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                    )
                }
            }

            Text(
                text = "${payment.concept} • Cat: ${payment.category}",
                fontSize = 13.sp,
                color = Slate600
            )

            Divider(color = Slate200.copy(alpha = 0.6f))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text("Importe", fontSize = 11.sp, color = Slate400)
                    Text(
                        text = EmitiaViewModel.formatMoney(payment.amount, payment.currency),
                        fontSize = 16.sp,
                        fontWeight = FontWeight.ExtraBold,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                }

                if (payment.status != "completed") {
                    Button(
                        onClick = onApprove,
                        colors = ButtonDefaults.buttonColors(containerColor = IndigoPrimary),
                        shape = RoundedCornerShape(8.dp),
                        contentPadding = PaddingValues(horizontal = 14.dp, vertical = 6.dp),
                        modifier = Modifier.testTag("btn_pay_${payment.id}")
                    ) {
                        Text("Aprobar y Pagar", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}

@Composable
fun NewPaymentDialog(
    onDismiss: () -> Unit,
    onConfirm: (String, String, String, Double, String, String, String) -> Unit
) {
    var name by remember { mutableStateOf("") }
    var cuit by remember { mutableStateOf("") }
    var cbu by remember { mutableStateOf("") }
    var amountText by remember { mutableStateOf("") }
    var concept by remember { mutableStateOf("") }
    var category by remember { mutableStateOf("proveedores") }
    var date by remember { mutableStateOf("2026-07-20") }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Programar Nuevo Pago", fontWeight = FontWeight.Bold) },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                OutlinedTextField(
                    value = name,
                    onValueChange = { name = it },
                    label = { Text("Destinatario / Proveedor") },
                    modifier = Modifier.fillMaxWidth().testTag("input_pay_name")
                )
                OutlinedTextField(
                    value = cuit,
                    onValueChange = { cuit = it },
                    label = { Text("CUIT / CUIL") },
                    modifier = Modifier.fillMaxWidth().testTag("input_pay_cuit")
                )
                OutlinedTextField(
                    value = cbu,
                    onValueChange = { cbu = it },
                    label = { Text("CBU / Alias") },
                    modifier = Modifier.fillMaxWidth().testTag("input_pay_cbu")
                )
                OutlinedTextField(
                    value = amountText,
                    onValueChange = { amountText = it },
                    label = { Text("Monto ARS") },
                    modifier = Modifier.fillMaxWidth().testTag("input_pay_amount")
                )
                OutlinedTextField(
                    value = concept,
                    onValueChange = { concept = it },
                    label = { Text("Concepto") },
                    modifier = Modifier.fillMaxWidth().testTag("input_pay_concept")
                )
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    val amount = amountText.toDoubleOrNull() ?: 0.0
                    if (name.isNotBlank() && amount > 0) {
                        onConfirm(name, cuit, cbu, amount, concept, category, date)
                    }
                },
                colors = ButtonDefaults.buttonColors(containerColor = IndigoPrimary),
                modifier = Modifier.testTag("btn_confirm_new_payment")
            ) {
                Text("Guardar Pago")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Cancelar")
            }
        }
    )
}

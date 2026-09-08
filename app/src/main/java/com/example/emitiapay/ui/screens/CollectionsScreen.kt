package com.example.emitiapay.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
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
import com.example.emitiapay.data.model.CollectionRequest
import com.example.emitiapay.ui.theme.*
import com.example.emitiapay.ui.viewmodel.EmitiaViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CollectionsScreen(
    viewModel: EmitiaViewModel
) {
    val collections by viewModel.collections.collectAsState()
    var showNewDialog by remember { mutableStateOf(false) }
    var selectedQrCollection by remember { mutableStateOf<CollectionRequest?>(null) }

    Scaffold(
        floatingActionButton = {
            FloatingActionButton(
                onClick = { showNewDialog = true },
                containerColor = IndigoPrimary,
                contentColor = Color.White,
                modifier = Modifier.testTag("fab_new_collection")
            ) {
                Icon(Icons.Default.Add, contentDescription = "Solicitar Cobro")
            }
        },
        containerColor = MaterialTheme.colorScheme.background
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .testTag("collections_screen"),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            item {
                Text(
                    text = "Cobranzas y Facturación",
                    style = MaterialTheme.typography.titleLarge,
                    color = MaterialTheme.colorScheme.onBackground
                )
                Text(
                    text = "Generá links de pago, QR interoperables y controlá facturas",
                    fontSize = 13.sp,
                    color = Slate600
                )
            }

            items(collections) { item ->
                val (statusLabel, statusBg, statusColor) = when (item.status) {
                    "collected" -> Triple("Cobrado", EmeraldLight, EmeraldSuccess)
                    "overdue" -> Triple("Vencido", RoseLight, RoseError)
                    "sent" -> Triple("Enviado", Color(0xFFEEF2FF), IndigoPrimary)
                    else -> Triple("Pendiente", AmberLight, AmberWarning)
                }

                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("col_card_${item.id}"),
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
                                    text = item.clientName,
                                    fontSize = 15.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = MaterialTheme.colorScheme.onSurface
                                )
                                Text(
                                    text = "${item.invoiceNumber} • ${item.clientEmail}",
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
                            text = "${item.concept} • Vto: ${item.dueDate}",
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
                                Text("Monto", fontSize = 11.sp, color = Slate400)
                                Text(
                                    text = EmitiaViewModel.formatMoney(item.amount, item.currency),
                                    fontSize = 16.sp,
                                    fontWeight = FontWeight.ExtraBold,
                                    color = MaterialTheme.colorScheme.onSurface
                                )
                            }

                            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                OutlinedButton(
                                    onClick = { selectedQrCollection = item },
                                    shape = RoundedCornerShape(8.dp),
                                    contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp),
                                    modifier = Modifier.testTag("btn_qr_${item.id}")
                                ) {
                                    Icon(Icons.Default.QrCode, contentDescription = null, modifier = Modifier.size(16.dp))
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text("Ver QR", fontSize = 12.sp)
                                }

                                if (item.status != "collected") {
                                    Button(
                                        onClick = { viewModel.markCollectionCollected(item.id, item.amount) },
                                        colors = ButtonDefaults.buttonColors(containerColor = EmeraldSuccess),
                                        shape = RoundedCornerShape(8.dp),
                                        contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp),
                                        modifier = Modifier.testTag("btn_collect_${item.id}")
                                    ) {
                                        Text("Cobrado", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    // QR Modal Dialog
    if (selectedQrCollection != null) {
        val col = selectedQrCollection!!
        AlertDialog(
            onDismissRequest = { selectedQrCollection = null },
            title = { Text("Código QR de Cobro Interoperable", fontWeight = FontWeight.Bold) },
            text = {
                Column(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Text(
                        text = "Escaneá con cualquier billetera o app bancaria (Transferencias 3.0)",
                        fontSize = 12.sp,
                        color = Slate600
                    )

                    // Simulated QR Pattern
                    Box(
                        modifier = Modifier
                            .size(180.dp)
                            .background(Color.White, RoundedCornerShape(12.dp))
                            .padding(16.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                            repeat(8) {
                                Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                                    repeat(8) {
                                        val fill = (it % 2 == 0) || (it % 3 == 0)
                                        Box(
                                            modifier = Modifier
                                                .size(14.dp)
                                                .background(if (fill) Slate900 else Color(0xFFF1F5F9))
                                        )
                                    }
                                }
                            }
                        }
                    }

                    Text(
                        text = EmitiaViewModel.formatMoney(col.amount, col.currency),
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                    Text("Destino: EMITIA PAY • CUIT 30-88992211-5", fontSize = 11.sp, color = Slate400)
                }
            },
            confirmButton = {
                Button(
                    onClick = { selectedQrCollection = null },
                    colors = ButtonDefaults.buttonColors(containerColor = IndigoPrimary)
                ) {
                    Text("Cerrar")
                }
            }
        )
    }

    // New Collection Dialog
    if (showNewDialog) {
        var clientName by remember { mutableStateOf("") }
        var clientEmail by remember { mutableStateOf("") }
        var amountText by remember { mutableStateOf("") }
        var concept by remember { mutableStateOf("") }
        var invoice by remember { mutableStateOf("FC-0001-${(1000..9999).random()}") }

        AlertDialog(
            onDismissRequest = { showNewDialog = false },
            title = { Text("Nueva Solicitud de Cobro", fontWeight = FontWeight.Bold) },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    OutlinedTextField(
                        value = clientName,
                        onValueChange = { clientName = it },
                        label = { Text("Cliente / Razón Social") },
                        modifier = Modifier.fillMaxWidth().testTag("input_col_client")
                    )
                    OutlinedTextField(
                        value = clientEmail,
                        onValueChange = { clientEmail = it },
                        label = { Text("Email de envío") },
                        modifier = Modifier.fillMaxWidth().testTag("input_col_email")
                    )
                    OutlinedTextField(
                        value = amountText,
                        onValueChange = { amountText = it },
                        label = { Text("Monto ARS") },
                        modifier = Modifier.fillMaxWidth().testTag("input_col_amount")
                    )
                    OutlinedTextField(
                        value = concept,
                        onValueChange = { concept = it },
                        label = { Text("Concepto o Factura") },
                        modifier = Modifier.fillMaxWidth().testTag("input_col_concept")
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        val amount = amountText.toDoubleOrNull() ?: 0.0
                        if (clientName.isNotBlank() && amount > 0) {
                            viewModel.createCollection(clientName, clientEmail, amount, concept, invoice, "2026-07-28")
                            showNewDialog = false
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = IndigoPrimary),
                    modifier = Modifier.testTag("btn_confirm_new_collection")
                ) {
                    Text("Emitir Cobro")
                }
            },
            dismissButton = {
                TextButton(onClick = { showNewDialog = false }) {
                    Text("Cancelar")
                }
            }
        )
    }
}

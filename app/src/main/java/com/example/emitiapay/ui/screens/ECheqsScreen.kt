package com.example.emitiapay.ui.screens

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
import com.example.emitiapay.data.model.ECheq
import com.example.emitiapay.ui.theme.*
import com.example.emitiapay.ui.viewmodel.EmitiaViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ECheqsScreen(
    viewModel: EmitiaViewModel
) {
    val echeqs by viewModel.echeqs.collectAsState()
    val accounts by viewModel.accounts.collectAsState()
    var showEmitDialog by remember { mutableStateOf(false) }

    val emitidosCount = echeqs.count { it.status == "emitido" }
    val pendientesCount = echeqs.count { it.status == "pendiente" }
    val depositadosCount = echeqs.count { it.status == "depositado" }

    Scaffold(
        floatingActionButton = {
            FloatingActionButton(
                onClick = { showEmitDialog = true },
                containerColor = IndigoPrimary,
                contentColor = Color.White,
                modifier = Modifier.testTag("fab_emit_echeq")
            ) {
                Icon(Icons.Default.Add, contentDescription = "Emitir eCheq")
            }
        },
        containerColor = MaterialTheme.colorScheme.background
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .testTag("echeqs_screen"),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            item {
                Text(
                    text = "Cheques Electrónicos (eCheqs)",
                    style = MaterialTheme.typography.titleLarge,
                    color = MaterialTheme.colorScheme.onBackground
                )
                Text(
                    text = "Emisión, custodia y depósito con validación COELSA",
                    fontSize = 13.sp,
                    color = Slate600
                )
            }

            // Summary metrics
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Card(
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(12.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
                    ) {
                        Column(modifier = Modifier.padding(12.dp)) {
                            Text("Emitidos", fontSize = 11.sp, color = Slate400)
                            Text("$emitidosCount", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = IndigoPrimary)
                        }
                    }
                    Card(
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(12.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
                    ) {
                        Column(modifier = Modifier.padding(12.dp)) {
                            Text("Pendientes", fontSize = 11.sp, color = Slate400)
                            Text("$pendientesCount", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = AmberWarning)
                        }
                    }
                    Card(
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(12.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
                    ) {
                        Column(modifier = Modifier.padding(12.dp)) {
                            Text("Depositados", fontSize = 11.sp, color = Slate400)
                            Text("$depositadosCount", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = EmeraldSuccess)
                        }
                    }
                }
            }

            items(echeqs) { ech ->
                val (statusLabel, statusBg, statusColor) = when (ech.status) {
                    "depositado" -> Triple("Depositado", EmeraldLight, EmeraldSuccess)
                    "pendiente" -> Triple("Pendiente", AmberLight, AmberWarning)
                    else -> Triple("Emitido", Color(0xFFEEF2FF), IndigoPrimary)
                }

                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("echeq_card_${ech.id}"),
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
                                    text = ech.chequeNumber,
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = IndigoPrimary
                                )
                                Text(
                                    text = "Beneficiario: ${ech.recipientName}",
                                    fontSize = 13.sp,
                                    fontWeight = FontWeight.SemiBold,
                                    color = MaterialTheme.colorScheme.onSurface
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
                            text = "CUIT: ${ech.recipientCuit} • Concepto: ${ech.concept}",
                            fontSize = 12.sp,
                            color = Slate600
                        )

                        Text(
                            text = "Emisión: ${ech.emissionDate} • Fecha de pago: ${ech.dueDate}",
                            fontSize = 11.sp,
                            color = Slate400
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
                                    text = EmitiaViewModel.formatMoney(ech.amount, ech.currency),
                                    fontSize = 16.sp,
                                    fontWeight = FontWeight.ExtraBold,
                                    color = MaterialTheme.colorScheme.onSurface
                                )
                            }

                            if (ech.status == "pendiente") {
                                Button(
                                    onClick = {
                                        val targetAcc = accounts.firstOrNull()?.id ?: "acc_1"
                                        viewModel.depositECheq(ech.id, ech.amount, targetAcc)
                                    },
                                    colors = ButtonDefaults.buttonColors(containerColor = EmeraldSuccess),
                                    shape = RoundedCornerShape(8.dp),
                                    contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp),
                                    modifier = Modifier.testTag("btn_deposit_${ech.id}")
                                ) {
                                    Icon(Icons.Default.AccountBalance, contentDescription = null, modifier = Modifier.size(14.dp))
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text("Depositar", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    if (showEmitDialog) {
        var recipient by remember { mutableStateOf("") }
        var cuit by remember { mutableStateOf("") }
        var amountText by remember { mutableStateOf("") }
        var concept by remember { mutableStateOf("") }
        var dueDate by remember { mutableStateOf("2026-08-15") }

        AlertDialog(
            onDismissRequest = { showEmitDialog = false },
            title = { Text("Emitir Nuevo eCheq", fontWeight = FontWeight.Bold) },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    OutlinedTextField(
                        value = recipient,
                        onValueChange = { recipient = it },
                        label = { Text("Beneficiario (Razón Social o Nombre)") },
                        modifier = Modifier.fillMaxWidth().testTag("input_ech_recipient")
                    )
                    OutlinedTextField(
                        value = cuit,
                        onValueChange = { cuit = it },
                        label = { Text("CUIT / CUIL del Beneficiario") },
                        modifier = Modifier.fillMaxWidth().testTag("input_ech_cuit")
                    )
                    OutlinedTextField(
                        value = amountText,
                        onValueChange = { amountText = it },
                        label = { Text("Monto ARS") },
                        modifier = Modifier.fillMaxWidth().testTag("input_ech_amount")
                    )
                    OutlinedTextField(
                        value = concept,
                        onValueChange = { concept = it },
                        label = { Text("Concepto") },
                        modifier = Modifier.fillMaxWidth().testTag("input_ech_concept")
                    )
                    OutlinedTextField(
                        value = dueDate,
                        onValueChange = { dueDate = it },
                        label = { Text("Fecha de Pago (YYYY-MM-DD)") },
                        modifier = Modifier.fillMaxWidth().testTag("input_ech_due_date")
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        val amount = amountText.toDoubleOrNull() ?: 0.0
                        if (recipient.isNotBlank() && amount > 0) {
                            viewModel.createECheq(recipient, cuit, amount, concept, dueDate)
                            showEmitDialog = false
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = IndigoPrimary),
                    modifier = Modifier.testTag("btn_confirm_emit_echeq")
                ) {
                    Text("Emitir eCheq")
                }
            },
            dismissButton = {
                TextButton(onClick = { showEmitDialog = false }) {
                    Text("Cancelar")
                }
            }
        )
    }
}

package com.example.emitiapay.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.emitiapay.data.model.Investment
import com.example.emitiapay.ui.theme.*
import com.example.emitiapay.ui.viewmodel.EmitiaViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun InvestmentsScreen(
    viewModel: EmitiaViewModel
) {
    val investments by viewModel.investments.collectAsState()
    val accounts by viewModel.accounts.collectAsState()

    var showConstituteDialog by remember { mutableStateOf(false) }
    var selectedProductType by remember { mutableStateOf("fci") }

    val products = listOf(
        Triple("fci", "Fondo Money Market T+0", 0.42),
        Triple("plazo_fijo", "Plazo Fijo Tradicional 30d", 0.386),
        Triple("bonos", "Bonos Soberanos en USD", 0.25)
    )

    Scaffold(
        floatingActionButton = {
            FloatingActionButton(
                onClick = { showConstituteDialog = true },
                containerColor = IndigoPrimary,
                contentColor = Color.White,
                modifier = Modifier.testTag("fab_new_investment")
            ) {
                Icon(Icons.Default.TrendingUp, contentDescription = "Invertir")
            }
        },
        containerColor = MaterialTheme.colorScheme.background
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .testTag("investments_screen"),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            item {
                Text(
                    text = "Inversiones y Rendimientos",
                    style = MaterialTheme.typography.titleLarge,
                    color = MaterialTheme.colorScheme.onBackground
                )
                Text(
                    text = "Optimizá la liquidez de tu tesorería corporativa con rescate inmediato",
                    fontSize = 13.sp,
                    color = Slate600
                )
            }

            // Products Grid
            item {
                Text("Instrumentos Disponibles", style = MaterialTheme.typography.titleMedium)
                Spacer(modifier = Modifier.height(8.dp))
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    products.forEach { (type, name, tna) ->
                        Card(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clickable {
                                    selectedProductType = type
                                    showConstituteDialog = true
                                },
                            shape = RoundedCornerShape(12.dp),
                            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
                        ) {
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(14.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column {
                                    Text(name, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                                    Text(
                                        if (type == "fci") "Liquidez inmediata 24/7" else "Plazo mínimo 30 días",
                                        fontSize = 12.sp,
                                        color = Slate400
                                    )
                                }
                                Surface(
                                    shape = RoundedCornerShape(8.dp),
                                    color = EmeraldLight
                                ) {
                                    Text(
                                        text = "${(tna * 100).toInt()}% TNA",
                                        color = EmeraldSuccess,
                                        fontWeight = FontWeight.ExtraBold,
                                        fontSize = 13.sp,
                                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                                    )
                                }
                            }
                        }
                    }
                }
            }

            // Active Investments
            item {
                Text("Inversiones Activas", style = MaterialTheme.typography.titleMedium)
            }

            items(investments) { inv ->
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("inv_card_${inv.id}"),
                    shape = RoundedCornerShape(14.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
                ) {
                    Column(
                        modifier = Modifier.padding(16.dp),
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = inv.title,
                                fontSize = 15.sp,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.onSurface
                            )
                            Surface(
                                shape = RoundedCornerShape(6.dp),
                                color = EmeraldLight
                            ) {
                                Text(
                                    text = "Activo",
                                    color = EmeraldSuccess,
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                )
                            }
                        }

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Column {
                                Text("Capital Invertido", fontSize = 11.sp, color = Slate400)
                                Text(
                                    text = EmitiaViewModel.formatMoney(inv.amount, inv.currency),
                                    fontSize = 15.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                            Column(horizontalAlignment = Alignment.End) {
                                Text("Rendimiento Estimado", fontSize = 11.sp, color = Slate400)
                                Text(
                                    text = "+${EmitiaViewModel.formatMoney(inv.estimatedYield, inv.currency)}",
                                    fontSize = 15.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = EmeraldSuccess
                                )
                            }
                        }

                        Text(
                            text = "Tasa Nominal Anual: ${(inv.tna * 100)}% • Plazo: ${inv.durationDays} días",
                            fontSize = 11.sp,
                            color = Slate600
                        )
                    }
                }
            }
        }
    }

    if (showConstituteDialog) {
        val prod = products.find { it.first == selectedProductType } ?: products.first()
        var amountText by remember { mutableStateOf("") }
        var daysText by remember { mutableStateOf("30") }
        var accountId by remember { mutableStateOf(accounts.firstOrNull()?.id ?: "") }

        val amountNum = amountText.toDoubleOrNull() ?: 0.0
        val daysNum = daysText.toIntOrNull() ?: 30
        val estimatedReturn = (amountNum * prod.third * daysNum) / 365.0

        AlertDialog(
            onDismissRequest = { showConstituteDialog = false },
            title = { Text("Constituir Inversión", fontWeight = FontWeight.Bold) },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Text(prod.second, fontWeight = FontWeight.Bold, color = IndigoPrimary)
                    Text("Tasa TNA: ${(prod.third * 100)}%", fontSize = 12.sp, color = Slate600)

                    OutlinedTextField(
                        value = amountText,
                        onValueChange = { amountText = it },
                        label = { Text("Monto a Invertir (ARS)") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        modifier = Modifier.fillMaxWidth().testTag("input_inv_amount")
                    )

                    OutlinedTextField(
                        value = daysText,
                        onValueChange = { daysText = it },
                        label = { Text("Plazo en Días") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        modifier = Modifier.fillMaxWidth().testTag("input_inv_days")
                    )

                    if (amountNum > 0) {
                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = EmeraldLight,
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Column(modifier = Modifier.padding(10.dp)) {
                                Text("Rendimiento estimado al vencimiento:", fontSize = 11.sp, color = Slate600)
                                Text(
                                    EmitiaViewModel.formatMoney(estimatedReturn, "ARS"),
                                    fontWeight = FontWeight.ExtraBold,
                                    color = EmeraldSuccess,
                                    fontSize = 16.sp
                                )
                            }
                        }
                    }
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        if (amountNum > 0) {
                            viewModel.constituteInvestment(
                                prod.first,
                                prod.second,
                                amountNum,
                                prod.third,
                                daysNum,
                                accountId
                            ) { success ->
                                if (success) showConstituteDialog = false
                            }
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = IndigoPrimary),
                    modifier = Modifier.testTag("btn_confirm_investment")
                ) {
                    Text("Invertir Fondos")
                }
            },
            dismissButton = {
                TextButton(onClick = { showConstituteDialog = false }) {
                    Text("Cancelar")
                }
            }
        )
    }
}

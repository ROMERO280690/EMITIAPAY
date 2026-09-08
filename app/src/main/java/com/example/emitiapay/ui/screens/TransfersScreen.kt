package com.example.emitiapay.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
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
import com.example.emitiapay.data.model.Account
import com.example.emitiapay.data.model.Contact
import com.example.emitiapay.ui.theme.*
import com.example.emitiapay.ui.viewmodel.EmitiaViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TransfersScreen(
    viewModel: EmitiaViewModel,
    onFinish: () -> Unit
) {
    val accounts by viewModel.accounts.collectAsState()
    val contacts by viewModel.contacts.collectAsState()

    var selectedTab by remember { mutableStateOf(0) } // 0: Propias, 1: Terceros
    var originAccountId by remember { mutableStateOf(accounts.firstOrNull()?.id ?: "") }
    var destAccountId by remember { mutableStateOf(accounts.getOrNull(1)?.id ?: "") }

    var selectedContactId by remember { mutableStateOf(contacts.firstOrNull()?.id ?: "") }
    var customName by remember { mutableStateOf("") }
    var customCbu by remember { mutableStateOf("") }
    var customCuit by remember { mutableStateOf("") }
    var isNewContact by remember { mutableStateOf(false) }

    var amountText by remember { mutableStateOf("") }
    var concept by remember { mutableStateOf("Pago a proveedores") }
    var showReviewDialog by remember { mutableStateOf(false) }
    var showSuccessDialog by remember { mutableStateOf(false) }

    val originAccount = accounts.find { it.id == originAccountId } ?: accounts.firstOrNull()
    val destAccount = accounts.find { it.id == destAccountId } ?: accounts.getOrNull(1)
    val selectedContact = contacts.find { it.id == selectedContactId }

    val amountNum = amountText.toDoubleOrNull() ?: 0.0
    val isDifferentCurrency = selectedTab == 0 && originAccount?.currency != destAccount?.currency
    val convertedAmount = if (isDifferentCurrency) {
        if (originAccount?.currency == "ARS") amountNum / 1250.0 else amountNum * 1250.0
    } else amountNum

    val canSubmit = amountNum > 0 && originAccount != null && amountNum <= originAccount.balance &&
            (if (selectedTab == 0) originAccountId != destAccountId else (if (isNewContact) customName.isNotBlank() && customCbu.isNotBlank() else selectedContact != null))

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp)
            .testTag("transfers_screen"),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Text(
            text = "Transferencias",
            style = MaterialTheme.typography.titleLarge,
            color = MaterialTheme.colorScheme.onBackground
        )

        TabRow(
            selectedTabIndex = selectedTab,
            containerColor = Color.Transparent,
            contentColor = IndigoPrimary
        ) {
            Tab(
                selected = selectedTab == 0,
                onClick = { selectedTab = 0 },
                text = { Text("Entre cuentas propias", fontWeight = FontWeight.SemiBold) },
                modifier = Modifier.testTag("tab_transfers_own")
            )
            Tab(
                selected = selectedTab == 1,
                onClick = { selectedTab = 1 },
                text = { Text("A terceros", fontWeight = FontWeight.SemiBold) },
                modifier = Modifier.testTag("tab_transfers_third")
            )
        }

        // Origin Account
        Text("Cuenta Origen", style = MaterialTheme.typography.titleMedium)
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(12.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
        ) {
            Column(modifier = Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                accounts.forEach { acc ->
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(
                                if (acc.id == originAccountId) Color(0xFFEEF2FF) else Color.Transparent,
                                RoundedCornerShape(8.dp)
                            )
                            .padding(8.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        RadioButton(
                            selected = acc.id == originAccountId,
                            onClick = { originAccountId = acc.id },
                            colors = RadioButtonDefaults.colors(selectedColor = IndigoPrimary),
                            modifier = Modifier.testTag("radio_origin_${acc.id}")
                        )
                        Column(modifier = Modifier.weight(1f)) {
                            Text(acc.name, fontWeight = FontWeight.SemiBold, fontSize = 14.sp)
                            Text("Saldo: ${EmitiaViewModel.formatMoney(acc.balance, acc.currency)}", fontSize = 12.sp, color = Slate600)
                        }
                    }
                }
            }
        }

        if (selectedTab == 0) {
            // Destination Account for Own Transfers
            Text("Cuenta Destino", style = MaterialTheme.typography.titleMedium)
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
            ) {
                Column(modifier = Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    accounts.filter { it.id != originAccountId }.forEach { acc ->
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .background(
                                    if (acc.id == destAccountId) Color(0xFFEEF2FF) else Color.Transparent,
                                    RoundedCornerShape(8.dp)
                                )
                                .padding(8.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            RadioButton(
                                selected = acc.id == destAccountId,
                                onClick = { destAccountId = acc.id },
                                colors = RadioButtonDefaults.colors(selectedColor = IndigoPrimary),
                                modifier = Modifier.testTag("radio_dest_${acc.id}")
                            )
                            Column(modifier = Modifier.weight(1f)) {
                                Text(acc.name, fontWeight = FontWeight.SemiBold, fontSize = 14.sp)
                                Text("Saldo actual: ${EmitiaViewModel.formatMoney(acc.balance, acc.currency)}", fontSize = 12.sp, color = Slate600)
                            }
                        }
                    }
                }
            }

            if (isDifferentCurrency) {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(containerColor = AmberLight)
                ) {
                    Row(
                        modifier = Modifier.padding(12.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Icon(Icons.Default.Info, contentDescription = null, tint = AmberWarning)
                        Text(
                            text = "Conversión de divisas: Tipo de cambio aplicado 1 USD = $1.250 ARS",
                            fontSize = 12.sp,
                            color = Slate700
                        )
                    }
                }
            }
        } else {
            // Destination Contact for Third Party
            Text("Destinatario", style = MaterialTheme.typography.titleMedium)
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
            ) {
                Column(modifier = Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        FilterChip(
                            selected = !isNewContact,
                            onClick = { isNewContact = false },
                            label = { Text("Contactos frecuentes") }
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        FilterChip(
                            selected = isNewContact,
                            onClick = { isNewContact = true },
                            label = { Text("Nuevo CBU / Alias") }
                        )
                    }

                    if (!isNewContact) {
                        contacts.forEach { c ->
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .background(
                                        if (c.id == selectedContactId) Color(0xFFEEF2FF) else Color.Transparent,
                                        RoundedCornerShape(8.dp)
                                    )
                                    .padding(8.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                RadioButton(
                                    selected = c.id == selectedContactId,
                                    onClick = { selectedContactId = c.id },
                                    colors = RadioButtonDefaults.colors(selectedColor = IndigoPrimary)
                                )
                                Column(modifier = Modifier.weight(1f)) {
                                    Text(c.name, fontWeight = FontWeight.SemiBold, fontSize = 14.sp)
                                    Text("CUIT: ${c.cuit} • ${c.bank}", fontSize = 12.sp, color = Slate600)
                                    Text("CBU: ${c.cbu}", fontSize = 11.sp, color = Slate400)
                                }
                            }
                        }
                    } else {
                        OutlinedTextField(
                            value = customName,
                            onValueChange = { customName = it },
                            label = { Text("Nombre o Razón Social") },
                            modifier = Modifier.fillMaxWidth().testTag("input_contact_name")
                        )
                        OutlinedTextField(
                            value = customCuit,
                            onValueChange = { customCuit = it },
                            label = { Text("CUIT / CUIL") },
                            modifier = Modifier.fillMaxWidth().testTag("input_contact_cuit")
                        )
                        OutlinedTextField(
                            value = customCbu,
                            onValueChange = { customCbu = it },
                            label = { Text("CBU o Alias") },
                            modifier = Modifier.fillMaxWidth().testTag("input_contact_cbu")
                        )
                    }
                }
            }
        }

        // Amount and Concept
        Text("Importe y Concepto", style = MaterialTheme.typography.titleMedium)
        OutlinedTextField(
            value = amountText,
            onValueChange = { amountText = it },
            label = { Text("Monto a transferir (${originAccount?.currency ?: "ARS"})") },
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
            leadingIcon = { Text(if (originAccount?.currency == "USD") "US$" else "$", fontWeight = FontWeight.Bold) },
            modifier = Modifier.fillMaxWidth().testTag("input_transfer_amount")
        )

        if (isDifferentCurrency && amountNum > 0) {
            Text(
                text = "Monto acreditado estimado: ${EmitiaViewModel.formatMoney(convertedAmount, destAccount?.currency ?: "USD")}",
                fontSize = 12.sp,
                fontWeight = FontWeight.SemiBold,
                color = EmeraldSuccess
            )
        }

        OutlinedTextField(
            value = concept,
            onValueChange = { concept = it },
            label = { Text("Concepto") },
            modifier = Modifier.fillMaxWidth().testTag("input_transfer_concept")
        )

        Button(
            onClick = { showReviewDialog = true },
            enabled = canSubmit,
            colors = ButtonDefaults.buttonColors(containerColor = IndigoPrimary),
            shape = RoundedCornerShape(12.dp),
            modifier = Modifier
                .fillMaxWidth()
                .height(50.dp)
                .testTag("btn_transfer_review")
        ) {
            Text("Revisar Transferencia", fontSize = 16.sp, fontWeight = FontWeight.Bold)
        }
    }

    // Review Dialog
    if (showReviewDialog) {
        AlertDialog(
            onDismissRequest = { showReviewDialog = false },
            title = { Text("Confirmar Transferencia") },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text("Desde: ${originAccount?.name}")
                    Text(
                        if (selectedTab == 0) "Hacia: ${destAccount?.name}"
                        else "Hacia: ${if (isNewContact) customName else selectedContact?.name}"
                    )
                    Text(
                        "Importe a debitar: ${EmitiaViewModel.formatMoney(amountNum, originAccount?.currency ?: "ARS")}",
                        fontWeight = FontWeight.Bold
                    )
                    if (isDifferentCurrency) {
                        Text(
                            "Importe a acreditar: ${EmitiaViewModel.formatMoney(convertedAmount, destAccount?.currency ?: "USD")}",
                            fontWeight = FontWeight.Bold,
                            color = EmeraldSuccess
                        )
                    }
                    Text("Concepto: $concept")
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        showReviewDialog = false
                        if (selectedTab == 0) {
                            viewModel.executeTransferOwn(originAccountId, destAccountId, amountNum) { success ->
                                if (success) showSuccessDialog = true
                            }
                        } else {
                            val name = if (isNewContact) customName else (selectedContact?.name ?: "")
                            val cuit = if (isNewContact) customCuit else (selectedContact?.cuit ?: "")
                            val cbu = if (isNewContact) customCbu else (selectedContact?.cbu ?: "")
                            viewModel.executeTransferThirdParty(originAccountId, name, cuit, cbu, amountNum, concept) { success ->
                                if (success) showSuccessDialog = true
                            }
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = IndigoPrimary),
                    modifier = Modifier.testTag("btn_confirm_transfer")
                ) {
                    Text("Confirmar y Enviar")
                }
            },
            dismissButton = {
                TextButton(onClick = { showReviewDialog = false }) {
                    Text("Cancelar")
                }
            }
        )
    }

    // Success Dialog
    if (showSuccessDialog) {
        AlertDialog(
            onDismissRequest = {
                showSuccessDialog = false
                onFinish()
            },
            icon = { Icon(Icons.Default.CheckCircle, contentDescription = null, tint = EmeraldSuccess, modifier = Modifier.size(48.dp)) },
            title = { Text("¡Transferencia Exitosa!", fontWeight = FontWeight.Bold) },
            text = {
                Text("La operación fue procesada de manera inmediata. El comprobante fue registrado en tus movimientos.")
            },
            confirmButton = {
                Button(
                    onClick = {
                        showSuccessDialog = false
                        onFinish()
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = IndigoPrimary),
                    modifier = Modifier.testTag("btn_transfer_success_done")
                ) {
                    Text("Finalizar")
                }
            }
        )
    }
}

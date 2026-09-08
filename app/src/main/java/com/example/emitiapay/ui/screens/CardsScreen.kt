package com.example.emitiapay.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.emitiapay.data.model.CorporateCard
import com.example.emitiapay.ui.theme.*
import com.example.emitiapay.ui.viewmodel.EmitiaViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CardsScreen(
    viewModel: EmitiaViewModel
) {
    val cards by viewModel.cards.collectAsState()
    var showNewCardDialog by remember { mutableStateOf(false) }

    Scaffold(
        floatingActionButton = {
            FloatingActionButton(
                onClick = { showNewCardDialog = true },
                containerColor = IndigoPrimary,
                contentColor = Color.White,
                modifier = Modifier.testTag("fab_new_card")
            ) {
                Icon(Icons.Default.Add, contentDescription = "Solicitar Tarjeta")
            }
        },
        containerColor = MaterialTheme.colorScheme.background
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .testTag("cards_screen"),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            item {
                Text(
                    text = "Tarjetas Corporativas",
                    style = MaterialTheme.typography.titleLarge,
                    color = MaterialTheme.colorScheme.onBackground
                )
                Text(
                    text = "Tarjetas físicas y virtuales para gastos de equipo y suscripciones",
                    fontSize = 13.sp,
                    color = Slate600
                )
            }

            items(cards) { card ->
                CorporateCardVisual(
                    card = card,
                    onToggleFreeze = { viewModel.toggleCardFreeze(card.id, card.status) }
                )
            }
        }
    }

    if (showNewCardDialog) {
        var holderName by remember { mutableStateOf("") }
        var cardType by remember { mutableStateOf("virtual") }
        var variant by remember { mutableStateOf("credit") }
        var currency by remember { mutableStateOf("ARS") }
        var limitText by remember { mutableStateOf("1000000") }

        AlertDialog(
            onDismissRequest = { showNewCardDialog = false },
            title = { Text("Emitir Tarjeta Corporativa", fontWeight = FontWeight.Bold) },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    OutlinedTextField(
                        value = holderName,
                        onValueChange = { holderName = it },
                        label = { Text("Nombre del Titular / Sector") },
                        modifier = Modifier.fillMaxWidth().testTag("input_card_holder")
                    )

                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        FilterChip(
                            selected = cardType == "virtual",
                            onClick = { cardType = "virtual" },
                            label = { Text("Virtual") }
                        )
                        FilterChip(
                            selected = cardType == "physical",
                            onClick = { cardType = "physical" },
                            label = { Text("Física") }
                        )
                    }

                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        FilterChip(
                            selected = currency == "ARS",
                            onClick = { currency = "ARS" },
                            label = { Text("ARS ($)") }
                        )
                        FilterChip(
                            selected = currency == "USD",
                            onClick = { currency = "USD" },
                            label = { Text("USD (US$)") }
                        )
                    }

                    OutlinedTextField(
                        value = limitText,
                        onValueChange = { limitText = it },
                        label = { Text("Límite Mensual ($currency)") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        modifier = Modifier.fillMaxWidth().testTag("input_card_limit")
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        val limit = limitText.toDoubleOrNull() ?: 500000.0
                        if (holderName.isNotBlank()) {
                            viewModel.createCard(holderName, cardType, variant, currency, limit)
                            showNewCardDialog = false
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = IndigoPrimary),
                    modifier = Modifier.testTag("btn_confirm_new_card")
                ) {
                    Text("Crear Tarjeta")
                }
            },
            dismissButton = {
                TextButton(onClick = { showNewCardDialog = false }) {
                    Text("Cancelar")
                }
            }
        )
    }
}

@Composable
fun CorporateCardVisual(
    card: CorporateCard,
    onToggleFreeze: () -> Unit
) {
    var revealCvv by remember { mutableStateOf(false) }
    val isFrozen = card.status == "frozen"

    val gradient = if (isFrozen) {
        listOf(Color(0xFF64748B), Color(0xFF475569), Color(0xFF334155))
    } else if (card.currency == "USD") {
        listOf(Color(0xFF047857), Color(0xFF065F46), Color(0xFF064E3B))
    } else {
        listOf(Color(0xFF4338CA), Color(0xFF3730A3), Color(0xFF1E1B4B))
    }

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .testTag("corp_card_${card.id}"),
        shape = RoundedCornerShape(20.dp),
        elevation = CardDefaults.cardElevation(defaultElevation = 3.dp)
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .background(Brush.linearGradient(gradient))
                .padding(20.dp)
        ) {
            Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
                // Card Top: Brand & Type
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "EMITIA CORPORATE",
                        color = Color.White.copy(alpha = 0.9f),
                        fontSize = 13.sp,
                        fontWeight = FontWeight.ExtraBold,
                        letterSpacing = 1.sp
                    )

                    Surface(
                        shape = RoundedCornerShape(6.dp),
                        color = if (isFrozen) Color(0xFFE2E8F0) else Color.White.copy(alpha = 0.2f)
                    ) {
                        Text(
                            text = if (isFrozen) "CONGELADA" else card.cardType.uppercase(),
                            color = if (isFrozen) Slate900 else Color.White,
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
                        )
                    }
                }

                // Chip & Contactless icon
                Row(
                    horizontalArrangement = Arrangement.spacedBy(10.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .size(32.dp, 24.dp)
                            .background(Color(0xFFFBBF24), RoundedCornerShape(4.dp))
                    )
                    Icon(
                        Icons.Default.Contactless,
                        contentDescription = null,
                        tint = Color.White.copy(alpha = 0.7f),
                        modifier = Modifier.size(20.dp)
                    )
                }

                // Card Number
                Text(
                    text = card.cardNumberMasked,
                    color = Color.White,
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 2.sp
                )

                // Holder, Expiry & CVV
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.Bottom
                ) {
                    Column {
                        Text("TITULAR", fontSize = 9.sp, color = Color.White.copy(alpha = 0.6f), fontWeight = FontWeight.SemiBold)
                        Text(card.holderName, fontSize = 13.sp, color = Color.White, fontWeight = FontWeight.Bold)
                    }

                    Column {
                        Text("VENCE", fontSize = 9.sp, color = Color.White.copy(alpha = 0.6f), fontWeight = FontWeight.SemiBold)
                        Text(card.expiryDate, fontSize = 12.sp, color = Color.White, fontWeight = FontWeight.Bold)
                    }

                    Column(horizontalAlignment = Alignment.End) {
                        Text("CVV", fontSize = 9.sp, color = Color.White.copy(alpha = 0.6f), fontWeight = FontWeight.SemiBold)
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = if (revealCvv) card.cvv else "•••",
                                fontSize = 12.sp,
                                color = Color.White,
                                fontWeight = FontWeight.Bold
                            )
                            IconButton(
                                onClick = { revealCvv = !revealCvv },
                                modifier = Modifier.size(24.dp)
                            ) {
                                Icon(
                                    if (revealCvv) Icons.Default.VisibilityOff else Icons.Default.Visibility,
                                    contentDescription = "Ver CVV",
                                    tint = Color.White.copy(alpha = 0.8f),
                                    modifier = Modifier.size(14.dp)
                                )
                            }
                        }
                    }
                }

                Divider(color = Color.White.copy(alpha = 0.2f))

                // Monthly Limit Progress & Freeze Button
                val progress = (card.spentAmount / card.monthlyLimit).toFloat().coerceIn(0f, 1f)
                Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(
                            text = "Consumo: ${EmitiaViewModel.formatMoney(card.spentAmount, card.currency)} de ${EmitiaViewModel.formatMoney(card.monthlyLimit, card.currency)}",
                            fontSize = 11.sp,
                            color = Color.White.copy(alpha = 0.8f)
                        )
                        Text(
                            text = "${(progress * 100).toInt()}%",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color.White
                        )
                    }
                    LinearProgressIndicator(
                        progress = { progress },
                        modifier = Modifier.fillMaxWidth().height(6.dp).clip(RoundedCornerShape(3.dp)),
                        color = if (progress > 0.85f) AmberWarning else CyanAccent,
                        trackColor = Color.White.copy(alpha = 0.2f)
                    )
                }

                Button(
                    onClick = onToggleFreeze,
                    colors = ButtonDefaults.buttonColors(
                        containerColor = if (isFrozen) EmeraldSuccess else Color.White.copy(alpha = 0.2f)
                    ),
                    shape = RoundedCornerShape(10.dp),
                    modifier = Modifier.fillMaxWidth().testTag("btn_freeze_${card.id}")
                ) {
                    Icon(
                        if (isFrozen) Icons.Default.LockOpen else Icons.Default.AcUnit,
                        contentDescription = null,
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(if (isFrozen) "Reactivar Tarjeta" else "Congelar Tarjeta", fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}

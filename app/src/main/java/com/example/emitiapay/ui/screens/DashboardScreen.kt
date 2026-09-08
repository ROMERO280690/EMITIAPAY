package com.example.emitiapay.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.emitiapay.data.model.Transaction
import com.example.emitiapay.ui.theme.*
import com.example.emitiapay.ui.viewmodel.EmitiaViewModel

@Composable
fun DashboardScreen(
    viewModel: EmitiaViewModel,
    onNavigate: (String) -> Unit
) {
    val totalArs by viewModel.totalBalanceArs.collectAsState()
    val totalUsd by viewModel.totalBalanceUsd.collectAsState()
    val transactions by viewModel.transactions.collectAsState()
    val payments by viewModel.payments.collectAsState()
    val collections by viewModel.collections.collectAsState()

    val pendingPaymentsSum = payments.filter { it.status == "scheduled" }.sumOf { it.amount }
    val pendingCollectionsSum = collections.filter { it.status == "pending" || it.status == "sent" }.sumOf { it.amount }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .testTag("dashboard_screen"),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Shadcn Page Header with Title and Action
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "Dashboard",
                        fontSize = 22.sp,
                        fontWeight = FontWeight.Bold,
                        color = Slate900
                    )
                    Text(
                        text = "Resumen de cuentas, liquidez y operaciones",
                        fontSize = 12.sp,
                        color = Slate600
                    )
                }

                Button(
                    onClick = { onNavigate("transfers") },
                    colors = ButtonDefaults.buttonColors(containerColor = Slate900),
                    shape = RoundedCornerShape(8.dp),
                    contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp),
                    modifier = Modifier.testTag("dashboard_header_action_button")
                ) {
                    Icon(Icons.Default.Add, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("Nueva Operación", fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                }
            }
        }

        // Balances Header Card (Shadcn Dark Metric Card)
        item {
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .testTag("balances_card"),
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = Slate900),
                elevation = CardDefaults.cardElevation(defaultElevation = 0.dp)
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(
                            Brush.linearGradient(
                                colors = listOf(Slate900, Color(0xFF1E1B4B), Slate900)
                            )
                        )
                        .padding(20.dp)
                ) {
                    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text(
                                    text = "SALDO TOTAL DISPONIBLE",
                                    color = Slate400,
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    letterSpacing = 1.sp
                                )
                                Text(
                                    text = EmitiaViewModel.formatMoney(totalArs, "ARS"),
                                    color = Color.White,
                                    fontSize = 28.sp,
                                    fontWeight = FontWeight.ExtraBold
                                )
                            }
                            Surface(
                                shape = RoundedCornerShape(6.dp),
                                color = Slate800,
                                border = androidx.compose.foundation.BorderStroke(1.dp, Slate700)
                            ) {
                                Text(
                                    text = "ARS / USD",
                                    color = CyanAccent,
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                                )
                            }
                        }

                        Divider(color = Slate700.copy(alpha = 0.5f))

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                                Icon(Icons.Default.MonetizationOn, contentDescription = null, tint = EmeraldSuccess, modifier = Modifier.size(18.dp))
                                Text(
                                    text = "Dólares:",
                                    color = Slate400,
                                    fontSize = 13.sp
                                )
                                Text(
                                    text = EmitiaViewModel.formatMoney(totalUsd, "USD"),
                                    color = Color.White,
                                    fontSize = 15.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            }

                            Text(
                                text = "TC MEP: $1.250",
                                color = Slate400,
                                fontSize = 12.sp
                            )
                        }
                    }
                }
            }
        }

        // Quick Actions
        item {
            Text(
                text = "Operaciones Rápidas",
                fontSize = 14.sp,
                fontWeight = FontWeight.Bold,
                color = Slate900
            )
            Spacer(modifier = Modifier.height(8.dp))
            Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    QuickActionItem(
                        icon = Icons.Default.SwapHoriz,
                        label = "Transferir",
                        modifier = Modifier
                            .weight(1f)
                            .testTag("action_transfer"),
                        onClick = { onNavigate("transfers") }
                    )
                    QuickActionItem(
                        icon = Icons.Default.Payment,
                        label = "Pagar",
                        modifier = Modifier
                            .weight(1f)
                            .testTag("action_payment"),
                        onClick = { onNavigate("payments") }
                    )
                    QuickActionItem(
                        icon = Icons.Default.QrCode,
                        label = "Cobrar QR",
                        modifier = Modifier
                            .weight(1f)
                            .testTag("action_collection"),
                        onClick = { onNavigate("collections") }
                    )
                }

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    QuickActionItem(
                        icon = Icons.Default.ReceiptLong,
                        label = "eCheqs",
                        modifier = Modifier
                            .weight(1f)
                            .testTag("action_echeq"),
                        onClick = { onNavigate("echeqs") }
                    )
                    QuickActionItem(
                        icon = Icons.Default.TrendingUp,
                        label = "Inversiones",
                        modifier = Modifier
                            .weight(1f)
                            .testTag("action_investments"),
                        onClick = { onNavigate("investments") }
                    )
                    QuickActionItem(
                        icon = Icons.Default.CreditCard,
                        label = "Tarjetas",
                        modifier = Modifier
                            .weight(1f)
                            .testTag("action_cards"),
                        onClick = { onNavigate("cards") }
                    )
                }
            }
        }

        // Cash Flow / Operating Metrics (Shadcn Stat Cards)
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                MetricCard(
                    title = "Pagos a Proveedores",
                    amount = pendingPaymentsSum,
                    badgeText = "Pendientes",
                    badgeColor = AmberLight,
                    badgeTextColor = AmberWarning,
                    modifier = Modifier
                        .weight(1f)
                        .testTag("metric_payments"),
                    onClick = { onNavigate("payments") }
                )
                MetricCard(
                    title = "Cobros a Recibir",
                    amount = pendingCollectionsSum,
                    badgeText = "Por cobrar",
                    badgeColor = EmeraldLight,
                    badgeTextColor = EmeraldSuccess,
                    modifier = Modifier
                        .weight(1f)
                        .testTag("metric_collections"),
                    onClick = { onNavigate("collections") }
                )
            }
        }

        // Treasury Investments & Corporate Cards Banner
        item {
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .border(1.dp, Slate200, RoundedCornerShape(12.dp))
                    .clickable { onNavigate("investments") }
                    .testTag("dashboard_investments_card"),
                shape = RoundedCornerShape(12.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                elevation = CardDefaults.cardElevation(defaultElevation = 0.dp)
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .size(42.dp)
                                .clip(RoundedCornerShape(8.dp))
                                .background(Color(0xFFECFDF5)),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(Icons.Default.TrendingUp, contentDescription = null, tint = EmeraldSuccess, modifier = Modifier.size(24.dp))
                        }
                        Column {
                            Text(
                                text = "Fondo Común Money Market T+0",
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.onSurface
                            )
                            Text(
                                text = "Rendimiento diario estimado: 42.0% TNA",
                                fontSize = 12.sp,
                                color = Slate600
                            )
                        }
                    }
                    Icon(Icons.Default.ChevronRight, contentDescription = null, tint = Slate400)
                }
            }
        }

        // Recent Transactions Title and List
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Movimientos Recientes",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    color = Slate900
                )
                Text(
                    text = "Ver cuentas",
                    color = IndigoPrimary,
                    fontSize = 13.sp,
                    fontWeight = FontWeight.SemiBold,
                    modifier = Modifier.clickable { onNavigate("accounts") }
                )
            }
        }

        items(transactions.take(5)) { tx ->
            TransactionItemRow(tx = tx)
        }
    }
}

@Composable
fun QuickActionItem(
    icon: ImageVector,
    label: String,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    Card(
        modifier = modifier
            .border(1.dp, Slate200, RoundedCornerShape(12.dp))
            .clickable(onClick = onClick),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 0.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 14.dp, horizontal = 4.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(38.dp)
                    .clip(RoundedCornerShape(8.dp))
                    .background(Color(0xFFEEF2FF)),
                contentAlignment = Alignment.Center
            ) {
                Icon(icon, contentDescription = label, tint = IndigoPrimary, modifier = Modifier.size(20.dp))
            }
            Text(
                text = label,
                fontSize = 12.sp,
                fontWeight = FontWeight.Medium,
                color = MaterialTheme.colorScheme.onSurface
            )
        }
    }
}

@Composable
fun MetricCard(
    title: String,
    amount: Double,
    badgeText: String,
    badgeColor: Color,
    badgeTextColor: Color,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    Card(
        modifier = modifier
            .border(1.dp, Slate200, RoundedCornerShape(12.dp))
            .clickable(onClick = onClick),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 0.dp)
    ) {
        Column(
            modifier = Modifier.padding(14.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Surface(
                shape = RoundedCornerShape(4.dp),
                color = badgeColor
            ) {
                Text(
                    text = badgeText,
                    color = badgeTextColor,
                    fontSize = 10.sp,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                )
            }
            Text(
                text = title,
                fontSize = 12.sp,
                color = Slate600
            )
            Text(
                text = EmitiaViewModel.formatMoney(amount, "ARS"),
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onSurface
            )
        }
    }
}

@Composable
fun TransactionItemRow(tx: Transaction) {
    val isPositive = tx.type in listOf("transfer_in", "collection", "deposit", "yield")
    val amountColor = if (isPositive) EmeraldSuccess else MaterialTheme.colorScheme.onSurface
    val icon = when (tx.type) {
        "transfer_in", "collection", "deposit" -> Icons.Default.ArrowDownward
        "yield" -> Icons.Default.TrendingUp
        else -> Icons.Default.ArrowUpward
    }
    val iconBg = if (isPositive) EmeraldLight else Slate100
    val iconTint = if (isPositive) EmeraldSuccess else Slate700

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .border(1.dp, Slate200, RoundedCornerShape(10.dp))
            .testTag("tx_item_${tx.id}"),
        shape = RoundedCornerShape(10.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 0.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Box(
                    modifier = Modifier
                        .size(36.dp)
                        .clip(RoundedCornerShape(8.dp))
                        .background(iconBg),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(icon, contentDescription = null, tint = iconTint, modifier = Modifier.size(18.dp))
                }
                Column(verticalArrangement = Arrangement.spacedBy(2.dp)) {
                    Text(
                        text = tx.description,
                        fontSize = 13.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                    Text(
                        text = if (tx.counterpartName.isNotEmpty()) "${tx.counterpartName} • ${tx.date}" else tx.date,
                        fontSize = 11.sp,
                        color = Slate400
                    )
                }
            }

            Column(horizontalAlignment = Alignment.End) {
                Text(
                    text = "${if (isPositive) "+" else "-"}${EmitiaViewModel.formatMoney(tx.amount, tx.currency)}",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold,
                    color = amountColor
                )
                Text(
                    text = tx.reference,
                    fontSize = 10.sp,
                    color = Slate400
                )
            }
        }
    }
}

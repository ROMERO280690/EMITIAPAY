package com.example.emitiapay.ui.screens

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.emitiapay.data.model.Account
import com.example.emitiapay.ui.theme.*
import com.example.emitiapay.ui.viewmodel.EmitiaViewModel

@Composable
fun AccountsScreen(
    viewModel: EmitiaViewModel,
    onNavigateTransfer: () -> Unit
) {
    val accounts by viewModel.accounts.collectAsState()
    val transactions by viewModel.transactions.collectAsState()
    var selectedAccountId by remember { mutableStateOf<String?>(null) }
    val context = LocalContext.current

    val activeAccount = accounts.find { it.id == (selectedAccountId ?: accounts.firstOrNull()?.id) }
    val filteredTxs = transactions.filter { it.accountId == activeAccount?.id }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .testTag("accounts_screen"),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            Text(
                text = "Cuentas Bancarias y Operativas",
                style = MaterialTheme.typography.titleLarge,
                color = MaterialTheme.colorScheme.onBackground
            )
            Text(
                text = "Administrá las cuentas de la empresa y consultá CBU / Alias",
                fontSize = 13.sp,
                color = Slate600
            )
        }

        items(accounts) { account ->
            val isSelected = account.id == activeAccount?.id
            AccountCardItem(
                account = account,
                isSelected = isSelected,
                onClick = { selectedAccountId = account.id },
                onCopy = { text, label ->
                    val clipboard = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
                    clipboard.setPrimaryClip(ClipData.newPlainText(label, text))
                    viewModel.showMessage("$label copiado al portapapeles")
                }
            )
        }

        if (activeAccount != null) {
            item {
                Spacer(modifier = Modifier.height(8.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Movimientos de ${activeAccount.name}",
                        style = MaterialTheme.typography.titleMedium,
                        color = MaterialTheme.colorScheme.onBackground
                    )
                    Button(
                        onClick = onNavigateTransfer,
                        colors = ButtonDefaults.buttonColors(containerColor = IndigoPrimary),
                        shape = RoundedCornerShape(10.dp),
                        contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp),
                        modifier = Modifier.testTag("btn_account_transfer")
                    ) {
                        Icon(Icons.Default.Send, contentDescription = null, modifier = Modifier.size(14.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Transferir", fontSize = 12.sp)
                    }
                }
            }

            if (filteredTxs.isEmpty()) {
                item {
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
                    ) {
                        Box(modifier = Modifier.fillMaxWidth().padding(24.dp), contentAlignment = Alignment.Center) {
                            Text("No hay movimientos registrados en esta cuenta", color = Slate400, fontSize = 13.sp)
                        }
                    }
                }
            } else {
                items(filteredTxs) { tx ->
                    TransactionItemRow(tx = tx)
                }
            }
        }
    }
}

@Composable
fun AccountCardItem(
    account: Account,
    isSelected: Boolean,
    onClick: () -> Unit,
    onCopy: (String, String) -> Unit
) {
    val borderColor = if (isSelected) IndigoPrimary else Color.Transparent
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick)
            .testTag("account_card_${account.id}"),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(
            containerColor = if (isSelected) Color(0xFFF5F3FF) else MaterialTheme.colorScheme.surface
        ),
        border = if (isSelected) androidx.compose.foundation.BorderStroke(1.5.dp, IndigoPrimary) else null,
        elevation = CardDefaults.cardElevation(defaultElevation = if (isSelected) 2.dp else 1.dp)
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
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    Box(
                        modifier = Modifier
                            .size(36.dp)
                            .clip(CircleShape)
                            .background(if (account.currency == "USD") Color(0xFFECFDF5) else Color(0xFFEEF2FF)),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = if (account.currency == "USD") "USD" else "ARS",
                            color = if (account.currency == "USD") EmeraldSuccess else IndigoPrimary,
                            fontWeight = FontWeight.Bold,
                            fontSize = 11.sp
                        )
                    }
                    Column {
                        Text(
                            text = account.name,
                            fontSize = 15.sp,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.onSurface
                        )
                        Text(
                            text = "Cuenta ${account.accountType.replaceFirstChar { it.uppercase() }}",
                            fontSize = 12.sp,
                            color = Slate400
                        )
                    }
                }

                Text(
                    text = EmitiaViewModel.formatMoney(account.balance, account.currency),
                    fontSize = 16.sp,
                    fontWeight = FontWeight.ExtraBold,
                    color = if (account.currency == "USD") EmeraldSuccess else MaterialTheme.colorScheme.onSurface
                )
            }

            Divider(color = Slate200.copy(alpha = 0.6f))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text("CBU", fontSize = 10.sp, color = Slate400, fontWeight = FontWeight.SemiBold)
                    Text(account.cbu, fontSize = 11.sp, color = Slate700, fontWeight = FontWeight.Medium)
                }
                IconButton(
                    onClick = { onCopy(account.cbu, "CBU") },
                    modifier = Modifier.size(32.dp).testTag("btn_copy_cbu_${account.id}")
                ) {
                    Icon(Icons.Default.ContentCopy, contentDescription = "Copiar CBU", tint = Slate600, modifier = Modifier.size(16.dp))
                }
            }

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text("ALIAS", fontSize = 10.sp, color = Slate400, fontWeight = FontWeight.SemiBold)
                    Text(account.alias, fontSize = 11.sp, color = IndigoPrimary, fontWeight = FontWeight.Bold)
                }
                IconButton(
                    onClick = { onCopy(account.alias, "Alias") },
                    modifier = Modifier.size(32.dp).testTag("btn_copy_alias_${account.id}")
                ) {
                    Icon(Icons.Default.ContentCopy, contentDescription = "Copiar Alias", tint = IndigoPrimary, modifier = Modifier.size(16.dp))
                }
            }
        }
    }
}

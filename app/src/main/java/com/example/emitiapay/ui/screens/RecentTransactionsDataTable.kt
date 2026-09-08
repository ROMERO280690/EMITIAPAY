package com.example.emitiapay.ui.screens

import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.emitiapay.ui.theme.*
import com.example.emitiapay.ui.viewmodel.EmitiaViewModel

/**
 * Data Model for Financial Operations in the Shadcn Data Table
 */
data class FinancialOperation(
    val id: String,
    val type: FinancialOpType,
    val concept: String,
    val subcategory: String,
    val counterpartyName: String,
    val counterpartyCuit: String,
    val bankOrCbu: String,
    val date: String,
    val amount: Double,
    val currency: String = "ARS",
    val isIncoming: Boolean,
    val status: FinancialOpStatus,
    val coelsaRef: String,
    val paymentMethod: String
)

enum class FinancialOpType(val displayName: String, val badgeColor: Color, val textColor: Color, val icon: ImageVector) {
    PAYMENT_SUPPLIER("Pago Proveedor", Color(0xFFEFF6FF), Color(0xFF2563EB), Icons.Default.Payment),
    E_CHEQ("e-Cheq", Color(0xFFF5F3FF), Color(0xFF7C3AED), Icons.Default.ReceiptLong),
    TRANSFER("Transferencia", Color(0xFFEEF2FF), Color(0xFF4F46E5), Icons.Default.SwapHoriz),
    COLLECTION_QR("Cobro QR", Color(0xFFECFDF5), Color(0xFF059669), Icons.Default.QrCode),
    PAYROLL("Nómina & Sueldos", Color(0xFFFFF7ED), Color(0xFFEA580C), Icons.Default.Badge)
}

enum class FinancialOpStatus(val label: String, val badgeBg: Color, val badgeText: Color) {
    COMPLETED("Completado", EmeraldLight, EmeraldSuccess),
    ACCREDITED("Acreditado", EmeraldLight, EmeraldSuccess),
    SCHEDULED("Programado", AmberLight, AmberWarning),
    IN_CUSTODY("En Custodia", Color(0xFFF5F3FF), Color(0xFF7C3AED)),
    ISSUED("Emitido", Color(0xFFEFF6FF), Color(0xFF2563EB)),
    PROCESSING("En Proceso", Slate100, Slate700)
}

/**
 * Curated Mock Financial Operations focused on Payments and e-Cheqs
 */
val MOCK_FINANCIAL_OPERATIONS = listOf(
    FinancialOperation(
        id = "OP-98402",
        type = FinancialOpType.PAYMENT_SUPPLIER,
        concept = "Factura A-0012-0004921",
        subcategory = "Insumos & Hardware IT",
        counterpartyName = "Tech Solutions Argentina S.A.",
        counterpartyCuit = "30-71492019-3",
        bankOrCbu = "Banco Galicia • CBU 00701231...",
        date = "Hoy, 11:24",
        amount = 1450000.00,
        currency = "ARS",
        isIncoming = false,
        status = FinancialOpStatus.COMPLETED,
        coelsaRef = "COELSA-9812401-2026",
        paymentMethod = "Transferencia Inmediata 3.0"
    ),
    FinancialOperation(
        id = "OP-98399",
        type = FinancialOpType.E_CHEQ,
        concept = "e-Cheq Diferido 30D #9201948",
        subcategory = "Obras Civiles & Reformas",
        counterpartyName = "Constructora del Plata S.R.L.",
        counterpartyCuit = "30-68910243-7",
        bankOrCbu = "Banco Santander • CBU 07202314...",
        date = "Hoy, 09:15",
        amount = 3280000.00,
        currency = "ARS",
        isIncoming = false,
        status = FinancialOpStatus.ISSUED,
        coelsaRef = "ECHEQ-BCRA-4921029",
        paymentMethod = "Custodia / Emisión eCheq"
    ),
    FinancialOperation(
        id = "OP-98387",
        type = FinancialOpType.E_CHEQ,
        concept = "e-Cheq Cruzado No a la Orden #8192031",
        subcategory = "Cobro Venta Mayorista",
        counterpartyName = "Distribuidora Mayorista Andina S.A.",
        counterpartyCuit = "30-70891234-1",
        bankOrCbu = "Banco BBVA • CBU 01700982...",
        date = "Ayer, 16:40",
        amount = 2150000.00,
        currency = "ARS",
        isIncoming = true,
        status = FinancialOpStatus.IN_CUSTODY,
        coelsaRef = "ECHEQ-BCRA-8891021",
        paymentMethod = "eCheq Cedido en Custodia"
    ),
    FinancialOperation(
        id = "OP-98375",
        type = FinancialOpType.PAYMENT_SUPPLIER,
        concept = "Infraestructura Cloud Q3 Enterprise",
        subcategory = "Servicios Tecnológicos",
        counterpartyName = "Amazon Web Services / Telecom",
        counterpartyCuit = "30-71649201-9",
        bankOrCbu = "Cuenta Corriente Especial USD",
        date = "Ayer, 14:10",
        amount = 3850.00,
        currency = "USD",
        isIncoming = false,
        status = FinancialOpStatus.COMPLETED,
        coelsaRef = "COELSA-USD-912049",
        paymentMethod = "Débito Directo Corporativo"
    ),
    FinancialOperation(
        id = "OP-98362",
        type = FinancialOpType.E_CHEQ,
        concept = "e-Cheq Descontado T+0 Tasa 38% TNA",
        subcategory = "Descuento en Mercado",
        counterpartyName = "BICE Fideicomiso Financiero",
        counterpartyCuit = "30-50001091-2",
        bankOrCbu = "Cuenta Corriente ARS EMITIA",
        date = "06 Sep, 18:00",
        amount = 4900000.00,
        currency = "ARS",
        isIncoming = true,
        status = FinancialOpStatus.ACCREDITED,
        coelsaRef = "MAV-ARG-2091823",
        paymentMethod = "Mercado Abierto de Valores"
    ),
    FinancialOperation(
        id = "OP-98350",
        type = FinancialOpType.PAYROLL,
        concept = "Liquidación Anticipos Quincena",
        subcategory = "Haberes de Planta",
        counterpartyName = "Nómina Empleados EMITIA (24 pers)",
        counterpartyCuit = "30-71829304-9",
        bankOrCbu = "Pago Masivo Banco Galicia",
        date = "05 Sep, 12:30",
        amount = 5620000.00,
        currency = "ARS",
        isIncoming = false,
        status = FinancialOpStatus.SCHEDULED,
        coelsaRef = "PAYROLL-LOT-4819",
        paymentMethod = "Lote Masivo Sueldos"
    ),
    FinancialOperation(
        id = "OP-98341",
        type = FinancialOpType.COLLECTION_QR,
        concept = "Terminal POS Interoperable #304",
        subcategory = "Cobranzas Comerciales",
        counterpartyName = "Supermercados El Progreso S.A.",
        counterpartyCuit = "20-29103948-2",
        bankOrCbu = "QR Interoperable COELSA",
        date = "05 Sep, 10:18",
        amount = 680000.00,
        currency = "ARS",
        isIncoming = true,
        status = FinancialOpStatus.ACCREDITED,
        coelsaRef = "QR-COELSA-7781920",
        paymentMethod = "QR Pagos Transferencias 3.0"
    ),
    FinancialOperation(
        id = "OP-98330",
        type = FinancialOpType.TRANSFER,
        concept = "Honorarios Asesoría Legal Corporativa",
        subcategory = "Honorarios Profesionales",
        counterpartyName = "Estudio Jurídico Marval & Asoc.",
        counterpartyCuit = "30-58192039-4",
        bankOrCbu = "Banco Ciudad • CBU 02901823...",
        date = "04 Sep, 15:45",
        amount = 450000.00,
        currency = "ARS",
        isIncoming = false,
        status = FinancialOpStatus.COMPLETED,
        coelsaRef = "COELSA-391024-91",
        paymentMethod = "Transferencia Interbancaria"
    )
)

/**
 * Shadcn-based 'Recent Transactions' Data Table Component
 * Features:
 * - Real-time operational filter tabs (Todos, Pagos, e-Cheqs, Cobros)
 * - Live keyword search by concept, counterparty, CUIT, or reference
 * - Horizontal-scroll tabular view complying with shadcn/ui table specifications
 * - Custom badges for Operation Type and Operation Status
 * - Interactive Voucher/Receipt Dialog on row click
 * - Pagination controls and summary footer
 */
@Composable
fun RecentTransactionsDataTable(
    onNavigate: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    var searchQuery by remember { mutableStateOf("") }
    var selectedFilterTab by remember { mutableStateOf("ALL") }
    var selectedOperationForDialog by remember { mutableStateOf<FinancialOperation?>(null) }
    var currentPage by remember { mutableStateOf(1) }
    val itemsPerPage = 5

    // Filter operations based on tab and search query
    val filteredOperations = remember(searchQuery, selectedFilterTab) {
        MOCK_FINANCIAL_OPERATIONS.filter { op ->
            val matchesTab = when (selectedFilterTab) {
                "PAYMENTS" -> op.type == FinancialOpType.PAYMENT_SUPPLIER || op.type == FinancialOpType.PAYROLL
                "ECHEQS" -> op.type == FinancialOpType.E_CHEQ
                "COLLECTIONS" -> op.type == FinancialOpType.COLLECTION_QR || op.type == FinancialOpType.TRANSFER
                else -> true
            }

            val query = searchQuery.trim().lowercase()
            val matchesSearch = query.isEmpty() ||
                    op.concept.lowercase().contains(query) ||
                    op.counterpartyName.lowercase().contains(query) ||
                    op.counterpartyCuit.lowercase().contains(query) ||
                    op.coelsaRef.lowercase().contains(query) ||
                    op.id.lowercase().contains(query)

            matchesTab && matchesSearch
        }
    }

    val totalPages = maxOf(1, (filteredOperations.size + itemsPerPage - 1) / itemsPerPage)
    val pagedOperations = remember(filteredOperations, currentPage) {
        val safePage = currentPage.coerceIn(1, totalPages)
        val startIndex = (safePage - 1) * itemsPerPage
        filteredOperations.drop(startIndex).take(itemsPerPage)
    }

    Card(
        modifier = modifier
            .fillMaxWidth()
            .border(1.dp, Slate200, RoundedCornerShape(12.dp))
            .testTag("recent_transactions_datatable_card"),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 0.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            // Table Header Toolbar
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Text(
                            text = "Operaciones Recientes",
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold,
                            color = Slate900
                        )
                        Surface(
                            shape = RoundedCornerShape(20.dp),
                            color = Color(0xFFEEF2FF),
                            border = androidx.compose.foundation.BorderStroke(1.dp, IndigoPrimary.copy(alpha = 0.2f))
                        ) {
                            Text(
                                text = "Shadcn Data Table",
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                color = IndigoPrimary,
                                modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                            )
                        }
                    }
                    Text(
                        text = "Historial en tiempo real de pagos a proveedores, e-Cheqs y transferencias COELSA.",
                        fontSize = 12.sp,
                        color = Slate600
                    )
                }

                TextButton(
                    onClick = { onNavigate("payments") },
                    colors = ButtonDefaults.textButtonColors(contentColor = IndigoPrimary),
                    contentPadding = PaddingValues(horizontal = 8.dp)
                ) {
                    Text("Ver todos", fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                    Spacer(modifier = Modifier.width(2.dp))
                    Icon(Icons.Default.ArrowForward, contentDescription = null, modifier = Modifier.size(14.dp))
                }
            }

            // Shadcn Search & Filter Bar
            Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                // Search Input Field
                OutlinedTextField(
                    value = searchQuery,
                    onValueChange = {
                        searchQuery = it
                        currentPage = 1
                    },
                    placeholder = {
                        Text(
                            "Buscar por proveedor, e-Cheq, CUIT o ref COELSA...",
                            fontSize = 12.sp,
                            color = Slate400
                        )
                    },
                    leadingIcon = {
                        Icon(
                            Icons.Default.Search,
                            contentDescription = "Buscar",
                            tint = Slate400,
                            modifier = Modifier.size(18.dp)
                        )
                    },
                    trailingIcon = {
                        if (searchQuery.isNotEmpty()) {
                            IconButton(onClick = { searchQuery = "" }) {
                                Icon(Icons.Default.Close, contentDescription = "Limpiar", tint = Slate400, modifier = Modifier.size(16.dp))
                            }
                        }
                    },
                    singleLine = true,
                    shape = RoundedCornerShape(8.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = IndigoPrimary,
                        unfocusedBorderColor = Slate200,
                        focusedContainerColor = Color.White,
                        unfocusedContainerColor = Slate50
                    ),
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(48.dp)
                        .testTag("datatable_search_input")
                )

                // Shadcn-style Segmented Filter Tabs
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .horizontalScroll(rememberScrollState()),
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    val tabs = listOf(
                        "ALL" to "Todos (${MOCK_FINANCIAL_OPERATIONS.size})",
                        "PAYMENTS" to "Pagos Proveedores (3)",
                        "ECHEQS" to "e-Cheqs (3)",
                        "COLLECTIONS" to "Cobros & Transf. (2)"
                    )

                    tabs.forEach { (key, label) ->
                        val isSelected = selectedFilterTab == key
                        Surface(
                            modifier = Modifier
                                .clip(RoundedCornerShape(6.dp))
                                .clickable {
                                    selectedFilterTab = key
                                    currentPage = 1
                                }
                                .testTag("filter_tab_$key"),
                            color = if (isSelected) Slate900 else Slate100,
                            shape = RoundedCornerShape(6.dp)
                        ) {
                            Text(
                                text = label,
                                fontSize = 11.sp,
                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                                color = if (isSelected) Color.White else Slate700,
                                modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp)
                            )
                        }
                    }
                }
            }

            // Shadcn Data Table Container with Horizontal Scroll
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .border(1.dp, Slate200, RoundedCornerShape(8.dp)),
                shape = RoundedCornerShape(8.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                elevation = CardDefaults.cardElevation(defaultElevation = 0.dp)
            ) {
                val tableScrollState = rememberScrollState()

                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .horizontalScroll(tableScrollState)
                ) {
                    // Table Column Headers (shadcn style: light uppercase letter-spaced)
                    Row(
                        modifier = Modifier
                            .background(Slate50)
                            .padding(horizontal = 14.dp, vertical = 10.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "OPERACIÓN & CONCEPTO",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = Slate600,
                            letterSpacing = 0.5.sp,
                            modifier = Modifier.width(220.dp)
                        )
                        Text(
                            text = "BENEFICIARIO / ORIGEN",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = Slate600,
                            letterSpacing = 0.5.sp,
                            modifier = Modifier.width(190.dp)
                        )
                        Text(
                            text = "TIPO",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = Slate600,
                            letterSpacing = 0.5.sp,
                            modifier = Modifier.width(130.dp)
                        )
                        Text(
                            text = "ESTADO",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = Slate600,
                            letterSpacing = 0.5.sp,
                            modifier = Modifier.width(110.dp)
                        )
                        Text(
                            text = "FECHA",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = Slate600,
                            letterSpacing = 0.5.sp,
                            modifier = Modifier.width(100.dp)
                        )
                        Text(
                            text = "MONTO",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = Slate600,
                            letterSpacing = 0.5.sp,
                            textAlign = TextAlign.End,
                            modifier = Modifier.width(130.dp)
                        )
                        Text(
                            text = "ACCIÓN",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = Slate600,
                            letterSpacing = 0.5.sp,
                            textAlign = TextAlign.Center,
                            modifier = Modifier.width(90.dp)
                        )
                    }

                    Divider(color = Slate200)

                    // Table Rows
                    if (pagedOperations.isEmpty()) {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 32.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Column(
                                horizontalAlignment = Alignment.CenterHorizontally,
                                verticalArrangement = Arrangement.spacedBy(6.dp)
                            ) {
                                Icon(Icons.Default.SearchOff, contentDescription = null, tint = Slate400, modifier = Modifier.size(32.dp))
                                Text("No se encontraron operaciones registradas.", fontSize = 13.sp, color = Slate600)
                                Text("Intenta cambiar los términos de búsqueda o el filtro.", fontSize = 11.sp, color = Slate400)
                            }
                        }
                    } else {
                        pagedOperations.forEachIndexed { index, op ->
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clickable { selectedOperationForDialog = op }
                                    .background(if (index % 2 == 1) Color(0xFFFAFAFA) else Color.White)
                                    .padding(horizontal = 14.dp, vertical = 10.dp)
                                    .testTag("datatable_row_${op.id}"),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                // 1. Operación & Concepto
                                Row(
                                    modifier = Modifier.width(220.dp),
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                                ) {
                                    Box(
                                        modifier = Modifier
                                            .size(32.dp)
                                            .clip(RoundedCornerShape(6.dp))
                                            .background(op.type.badgeColor),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Icon(
                                            op.type.icon,
                                            contentDescription = null,
                                            tint = op.type.textColor,
                                            modifier = Modifier.size(16.dp)
                                        )
                                    }
                                    Column {
                                        Text(
                                            text = op.concept,
                                            fontSize = 12.sp,
                                            fontWeight = FontWeight.SemiBold,
                                            color = Slate900,
                                            maxLines = 1,
                                            overflow = TextOverflow.Ellipsis
                                        )
                                        Text(
                                            text = "${op.id} • ${op.subcategory}",
                                            fontSize = 10.sp,
                                            color = Slate400,
                                            maxLines = 1
                                        )
                                    }
                                }

                                // 2. Beneficiario / Origen
                                Column(modifier = Modifier.width(190.dp)) {
                                    Text(
                                        text = op.counterpartyName,
                                        fontSize = 12.sp,
                                        fontWeight = FontWeight.Medium,
                                        color = Slate800,
                                        maxLines = 1,
                                        overflow = TextOverflow.Ellipsis
                                    )
                                    Text(
                                        text = "CUIT: ${op.counterpartyCuit}",
                                        fontSize = 10.sp,
                                        color = Slate400
                                    )
                                }

                                // 3. Tipo Badge (Shadcn Badge)
                                Box(modifier = Modifier.width(130.dp)) {
                                    Surface(
                                        shape = RoundedCornerShape(4.dp),
                                        color = op.type.badgeColor,
                                        border = androidx.compose.foundation.BorderStroke(1.dp, op.type.textColor.copy(alpha = 0.2f))
                                    ) {
                                        Text(
                                            text = op.type.displayName,
                                            color = op.type.textColor,
                                            fontSize = 10.sp,
                                            fontWeight = FontWeight.Bold,
                                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                        )
                                    }
                                }

                                // 4. Estado Badge (Shadcn Badge)
                                Box(modifier = Modifier.width(110.dp)) {
                                    Surface(
                                        shape = RoundedCornerShape(4.dp),
                                        color = op.status.badgeBg
                                    ) {
                                        Row(
                                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
                                            verticalAlignment = Alignment.CenterVertically,
                                            horizontalArrangement = Arrangement.spacedBy(4.dp)
                                        ) {
                                            Box(
                                                modifier = Modifier
                                                    .size(5.dp)
                                                    .clip(CircleShape)
                                                    .background(op.status.badgeText)
                                            )
                                            Text(
                                                text = op.status.label,
                                                color = op.status.badgeText,
                                                fontSize = 10.sp,
                                                fontWeight = FontWeight.Bold
                                            )
                                        }
                                    }
                                }

                                // 5. Fecha
                                Text(
                                    text = op.date,
                                    fontSize = 11.sp,
                                    color = Slate600,
                                    modifier = Modifier.width(100.dp)
                                )

                                // 6. Monto
                                Text(
                                    text = "${if (op.isIncoming) "+" else "-"}${EmitiaViewModel.formatMoney(op.amount, op.currency)}",
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = if (op.isIncoming) EmeraldSuccess else Slate900,
                                    textAlign = TextAlign.End,
                                    modifier = Modifier.width(130.dp)
                                )

                                // 7. Acción
                                Box(
                                    modifier = Modifier.width(90.dp),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Surface(
                                        shape = RoundedCornerShape(4.dp),
                                        color = Slate100,
                                        modifier = Modifier.clickable { selectedOperationForDialog = op }
                                    ) {
                                        Text(
                                            text = "Detalle",
                                            fontSize = 10.sp,
                                            fontWeight = FontWeight.SemiBold,
                                            color = Slate700,
                                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                                        )
                                    }
                                }
                            }

                            if (index < pagedOperations.size - 1) {
                                Divider(color = Slate100)
                            }
                        }
                    }
                }
            }

            // Table Footer with Pagination Controls & Statistics
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Mostrando ${pagedOperations.size} de ${filteredOperations.size} operaciones",
                    fontSize = 12.sp,
                    color = Slate600
                )

                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    OutlinedButton(
                        onClick = { if (currentPage > 1) currentPage-- },
                        enabled = currentPage > 1,
                        shape = RoundedCornerShape(6.dp),
                        contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp),
                        modifier = Modifier
                            .height(32.dp)
                            .testTag("datatable_prev_page")
                    ) {
                        Text("Anterior", fontSize = 11.sp)
                    }

                    Text(
                        text = "Pág. $currentPage de $totalPages",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Medium,
                        color = Slate700
                    )

                    OutlinedButton(
                        onClick = { if (currentPage < totalPages) currentPage++ },
                        enabled = currentPage < totalPages,
                        shape = RoundedCornerShape(6.dp),
                        contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp),
                        modifier = Modifier
                            .height(32.dp)
                            .testTag("datatable_next_page")
                    ) {
                        Text("Siguiente", fontSize = 11.sp)
                    }
                }
            }
        }
    }

    // Interactive Shadcn Detail Modal / Popover
    selectedOperationForDialog?.let { op ->
        OperationDetailModal(
            operation = op,
            onDismiss = { selectedOperationForDialog = null }
        )
    }
}

/**
 * Shadcn-styled Operation Detail Popover / Dialog
 * Displays standard Argentine banking electronic voucher info:
 * - Reference Coelsa
 * - Parties involved with CUIT
 * - Timestamp & Bank Settlement Method
 */
@Composable
fun OperationDetailModal(
    operation: FinancialOperation,
    onDismiss: () -> Unit
) {
    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                Box(
                    modifier = Modifier
                        .size(40.dp)
                        .clip(RoundedCornerShape(8.dp))
                        .background(operation.type.badgeColor),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        operation.type.icon,
                        contentDescription = null,
                        tint = operation.type.textColor,
                        modifier = Modifier.size(20.dp)
                    )
                }

                Column(modifier = Modifier.weight(1f)) {
                    Text("Comprobante de Operación", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Slate900)
                    Text(operation.coelsaRef, fontSize = 11.sp, color = Slate400, fontFamily = FontFamily.Monospace)
                }
            }
        },
        text = {
            Column(
                modifier = Modifier.fillMaxWidth(),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Divider(color = Slate200)

                // Large Amount Display
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(10.dp))
                        .background(Slate50)
                        .padding(14.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("IMPORTE TOTAL", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Slate400)
                        Text(
                            text = "${if (operation.isIncoming) "+" else "-"}${EmitiaViewModel.formatMoney(operation.amount, operation.currency)}",
                            fontSize = 22.sp,
                            fontWeight = FontWeight.ExtraBold,
                            color = if (operation.isIncoming) EmeraldSuccess else Slate900
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Surface(
                            shape = RoundedCornerShape(4.dp),
                            color = operation.status.badgeBg
                        ) {
                            Text(
                                text = operation.status.label.uppercase(),
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                color = operation.status.badgeText,
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp)
                            )
                        }
                    }
                }

                // Detailed Table Attributes
                DetailRowItem("Concepto:", operation.concept)
                DetailRowItem("Categoría:", operation.subcategory)
                DetailRowItem("Beneficiario / Origen:", operation.counterpartyName)
                DetailRowItem("CUIT / Identificación:", operation.counterpartyCuit)
                DetailRowItem("Canal / CBU:", operation.bankOrCbu)
                DetailRowItem("Método Operativo:", operation.paymentMethod)
                DetailRowItem("Fecha y Hora:", operation.date)

                Divider(color = Slate200)

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text("Homologación BCRA:", fontSize = 11.sp, color = Slate400)
                    Text("Certificado Válido", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = EmeraldSuccess)
                }
            }
        },
        confirmButton = {
            Button(
                onClick = onDismiss,
                colors = ButtonDefaults.buttonColors(containerColor = Slate900),
                shape = RoundedCornerShape(8.dp)
            ) {
                Text("Cerrar Comprobante", fontWeight = FontWeight.Bold)
            }
        }
    )
}

@Composable
fun DetailRowItem(label: String, value: String) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.Top
    ) {
        Text(
            text = label,
            fontSize = 12.sp,
            color = Slate600,
            modifier = Modifier.width(130.dp)
        )
        Text(
            text = value,
            fontSize = 12.sp,
            fontWeight = FontWeight.Medium,
            color = Slate900,
            textAlign = TextAlign.End,
            modifier = Modifier.weight(1f)
        )
    }
}

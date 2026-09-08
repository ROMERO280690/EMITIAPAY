package com.example.emitiapay.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.emitiapay.ui.theme.*
import com.example.emitiapay.ui.viewmodel.EmitiaViewModel
import com.example.emitiapay.ui.viewmodel.UserProfile
import kotlinx.coroutines.launch

data class NavItem(
    val route: String,
    val label: String,
    val icon: ImageVector,
    val section: String,
    val badge: String? = null,
    val description: String = ""
)

val NAV_ITEMS = listOf(
    // Section 1: Plataforma
    NavItem("dashboard", "Dashboard", Icons.Default.Dashboard, "Plataforma", description = "Visión general de saldos y operaciones"),
    NavItem("accounts", "Cuentas & CBU", Icons.Default.AccountBalance, "Plataforma", description = "Cuentas corrientes en ARS y USD"),
    NavItem("transfers", "Transferencias", Icons.Default.SwapHoriz, "Plataforma", description = "Transferencias inmediatas e interbancarias"),
    NavItem("cards", "Tarjetas Corp.", Icons.Default.CreditCard, "Plataforma", badge = "Pro", description = "Tarjetas de débito/crédito corporativas"),

    // Section 2: Tesorería & Finanzas
    NavItem("payments", "Pagos a Proveedores", Icons.Default.Payment, "Tesorería", description = "Pagos programados, nómina y servicios"),
    NavItem("collections", "Cobros & QR", Icons.Default.QrCode, "Tesorería", description = "Cobros con QR interoperable y facturas"),
    NavItem("echeqs", "eCheqs", Icons.Default.ReceiptLong, "Tesorería", badge = "Digital", description = "Emisión y custodia de cheques"),
    NavItem("investments", "Inversiones FCI", Icons.Default.TrendingUp, "Tesorería", badge = "42% TNA", description = "Fondo Money Market T+0")
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainScreen(viewModel: EmitiaViewModel) {
    val uiState by viewModel.uiState.collectAsState()
    val snackbarHostState = remember { SnackbarHostState() }
    val drawerState = rememberDrawerState(initialValue = DrawerValue.Closed)
    val scope = rememberCoroutineScope()

    var showProfileDialog by remember { mutableStateOf(false) }
    var showNotificationDialog by remember { mutableStateOf(false) }
    var showSearchDialog by remember { mutableStateOf(false) }

    LaunchedEffect(uiState.message) {
        uiState.message?.let { msg ->
            snackbarHostState.showSnackbar(msg)
            viewModel.clearMessage()
        }
    }

    // Google Sign-In Screen when not authenticated
    if (!uiState.isAuthenticated) {
        GoogleSignInScreen(
            onSignInSuccess = { name, email ->
                viewModel.loginWithGoogle(name = name, email = email)
            }
        )
        return
    }

    BoxWithConstraints(modifier = Modifier.fillMaxSize()) {
        val isWide = maxWidth >= 768.dp

        if (isWide) {
            // Desktop / Tablet Landscape Layout: Fixed Shadcn Sidebar on Left + Top Bar + Content
            Row(modifier = Modifier.fillMaxSize()) {
                // Left Navigation Sidebar (shadcn sidebar component)
                ShadcnSidebar(
                    selectedRoute = uiState.selectedTab,
                    userProfile = uiState.currentUser,
                    onSelectRoute = { route -> viewModel.selectTab(route) },
                    onProfileClick = { showProfileDialog = true },
                    modifier = Modifier
                        .width(260.dp)
                        .fillMaxHeight()
                        .background(MaterialTheme.colorScheme.surface)
                        .border(width = 1.dp, color = Slate200, shape = RoundedCornerShape(0.dp))
                )

                // Main Content Column
                Column(
                    modifier = Modifier
                        .weight(1f)
                        .fillMaxHeight()
                ) {
                    ShadcnTopBar(
                        selectedRoute = uiState.selectedTab,
                        userProfile = uiState.currentUser,
                        isMobile = false,
                        onOpenDrawer = {},
                        onSearchClick = { showSearchDialog = true },
                        onNotificationClick = { showNotificationDialog = true },
                        onProfileClick = { showProfileDialog = true }
                    )

                    Scaffold(
                        snackbarHost = { SnackbarHost(snackbarHostState) },
                        containerColor = MaterialTheme.colorScheme.background,
                        modifier = Modifier.weight(1f)
                    ) { padding ->
                        Box(
                            modifier = Modifier
                                .fillMaxSize()
                                .padding(padding)
                        ) {
                            ScreenContent(
                                selectedTab = uiState.selectedTab,
                                viewModel = viewModel,
                                onNavigate = { viewModel.selectTab(it) }
                            )
                        }
                    }
                }
            }
        } else {
            // Mobile / Compact Layout: Drawer Sidebar + Top Bar + Content + Quick Navigation
            ModalNavigationDrawer(
                drawerState = drawerState,
                drawerContent = {
                    ModalDrawerSheet(
                        drawerContainerColor = MaterialTheme.colorScheme.surface,
                        drawerTonalElevation = 0.dp,
                        modifier = Modifier.width(300.dp)
                    ) {
                        ShadcnSidebar(
                            selectedRoute = uiState.selectedTab,
                            userProfile = uiState.currentUser,
                            onSelectRoute = { route ->
                                viewModel.selectTab(route)
                                scope.launch { drawerState.close() }
                            },
                            onProfileClick = {
                                scope.launch { drawerState.close() }
                                showProfileDialog = true
                            },
                            modifier = Modifier.fillMaxSize()
                        )
                    }
                }
            ) {
                Scaffold(
                    topBar = {
                        ShadcnTopBar(
                            selectedRoute = uiState.selectedTab,
                            userProfile = uiState.currentUser,
                            isMobile = true,
                            onOpenDrawer = { scope.launch { drawerState.open() } },
                            onSearchClick = { showSearchDialog = true },
                            onNotificationClick = { showNotificationDialog = true },
                            onProfileClick = { showProfileDialog = true }
                        )
                    },
                    bottomBar = {
                        NavigationBar(
                            containerColor = MaterialTheme.colorScheme.surface,
                            tonalElevation = 0.dp,
                            modifier = Modifier
                                .border(width = 1.dp, color = Slate200)
                                .testTag("bottom_nav")
                        ) {
                            val mobileTabs = listOf(
                                NavItem("dashboard", "Inicio", Icons.Default.Dashboard, "Plataforma"),
                                NavItem("accounts", "Cuentas", Icons.Default.AccountBalance, "Plataforma"),
                                NavItem("transfers", "Transferir", Icons.Default.SwapHoriz, "Plataforma"),
                                NavItem("cards", "Tarjetas", Icons.Default.CreditCard, "Plataforma")
                            )

                            mobileTabs.forEach { item ->
                                NavigationBarItem(
                                    selected = uiState.selectedTab == item.route,
                                    onClick = { viewModel.selectTab(item.route) },
                                    icon = { Icon(item.icon, contentDescription = item.label, modifier = Modifier.size(20.dp)) },
                                    label = { Text(item.label, fontSize = 11.sp, fontWeight = if (uiState.selectedTab == item.route) FontWeight.Bold else FontWeight.Normal) },
                                    colors = NavigationBarItemDefaults.colors(
                                        selectedIconColor = IndigoPrimary,
                                        selectedTextColor = IndigoPrimary,
                                        indicatorColor = Color(0xFFEEF2FF)
                                    ),
                                    modifier = Modifier.testTag("nav_item_${item.route}")
                                )
                            }

                            // Drawer opener button
                            val isMoreSelected = uiState.selectedTab !in listOf("dashboard", "accounts", "transfers", "cards")
                            NavigationBarItem(
                                selected = isMoreSelected,
                                onClick = { scope.launch { drawerState.open() } },
                                icon = { Icon(Icons.Default.MenuOpen, contentDescription = "Menú Completo", modifier = Modifier.size(20.dp)) },
                                label = { Text("Menú", fontSize = 11.sp) },
                                colors = NavigationBarItemDefaults.colors(
                                    selectedIconColor = IndigoPrimary,
                                    selectedTextColor = IndigoPrimary,
                                    indicatorColor = Color(0xFFEEF2FF)
                                ),
                                modifier = Modifier.testTag("nav_item_menu")
                            )
                        }
                    },
                    snackbarHost = { SnackbarHost(snackbarHostState) },
                    containerColor = MaterialTheme.colorScheme.background
                ) { padding ->
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(padding)
                    ) {
                        ScreenContent(
                            selectedTab = uiState.selectedTab,
                            viewModel = viewModel,
                            onNavigate = { viewModel.selectTab(it) }
                        )
                    }
                }
            }
        }
    }

    // Shadcn-style User Profile Summary Dialog
    if (showProfileDialog) {
        ShadcnUserProfileDialog(
            userProfile = uiState.currentUser,
            onDismiss = { showProfileDialog = false },
            onNavigate = { route ->
                viewModel.selectTab(route)
                showProfileDialog = false
            },
            onLogout = {
                showProfileDialog = false
                viewModel.logout()
            }
        )
    }

    // Quick Search Dialog
    if (showSearchDialog) {
        AlertDialog(
            onDismissRequest = { showSearchDialog = false },
            title = {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Icon(Icons.Default.Search, contentDescription = null, tint = IndigoPrimary)
                    Text("Búsqueda Rápida", fontSize = 16.sp, fontWeight = FontWeight.Bold)
                }
            },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    OutlinedTextField(
                        value = "",
                        onValueChange = {},
                        placeholder = { Text("Buscar transferencias, CBU, eCheqs...", fontSize = 13.sp) },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true,
                        leadingIcon = { Icon(Icons.Default.Search, contentDescription = null, tint = Slate400) },
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = IndigoPrimary,
                            unfocusedBorderColor = Slate200
                        )
                    )
                    Text(
                        "Acceso rápido a operaciones:",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = Slate400
                    )
                    listOf(
                        "Transferencias directas" to "transfers",
                        "Pagos pendientes a proveedores" to "payments",
                        "Generar cobro QR" to "collections",
                        "Emitir nuevo eCheq" to "echeqs"
                    ).forEach { (label, route) ->
                        Surface(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(8.dp))
                                .clickable {
                                    viewModel.selectTab(route)
                                    showSearchDialog = false
                                },
                            color = Slate50,
                            shape = RoundedCornerShape(8.dp)
                        ) {
                            Row(
                                modifier = Modifier
                                    .padding(horizontal = 12.dp, vertical = 8.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(label, fontSize = 13.sp, color = Slate700)
                                Icon(Icons.Default.ChevronRight, contentDescription = null, tint = Slate400, modifier = Modifier.size(16.dp))
                            }
                        }
                    }
                }
            },
            confirmButton = {
                TextButton(onClick = { showSearchDialog = false }) {
                    Text("Cerrar")
                }
            }
        )
    }

    // Notifications Dialog
    if (showNotificationDialog) {
        AlertDialog(
            onDismissRequest = { showNotificationDialog = false },
            title = {
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Icon(Icons.Default.Notifications, contentDescription = null, tint = IndigoPrimary)
                    Text("Notificaciones del Sistema", fontSize = 16.sp, fontWeight = FontWeight.Bold)
                }
            },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Card(
                        colors = CardDefaults.cardColors(containerColor = Slate50),
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier.border(1.dp, Slate200, RoundedCornerShape(10.dp))
                    ) {
                        Column(modifier = Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Text("COELSA • Compensación", fontWeight = FontWeight.Bold, fontSize = 12.sp, color = IndigoPrimary)
                                Text("Hace 5m", fontSize = 10.sp, color = Slate400)
                            }
                            Text(
                                "El lote de transferencias bancarias 3094 fue liquidado correctamente.",
                                fontSize = 12.sp,
                                color = Slate700
                            )
                        }
                    }

                    Card(
                        colors = CardDefaults.cardColors(containerColor = Slate50),
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier.border(1.dp, Slate200, RoundedCornerShape(10.dp))
                    ) {
                        Column(modifier = Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Text("Fondo Money Market", fontWeight = FontWeight.Bold, fontSize = 12.sp, color = EmeraldSuccess)
                                Text("Hoy 08:30", fontSize = 10.sp, color = Slate400)
                            }
                            Text(
                                "Rendimiento diario acreditado en cuenta corriente: 42.0% TNA.",
                                fontSize = 12.sp,
                                color = Slate700
                            )
                        }
                    }
                }
            },
            confirmButton = {
                TextButton(onClick = { showNotificationDialog = false }) {
                    Text("Entendido", fontWeight = FontWeight.Bold)
                }
            }
        )
    }
}

/**
 * Shadcn-inspired Navigation Sidebar Component.
 * Contains:
 * - Organization Workspace Header
 * - Grouped Navigation Sections (Plataforma, Tesorería)
 * - Active pill states with Tailwind border & muted backgrounds
 * - Footer with User Profile Summary Card
 */
@Composable
fun ShadcnSidebar(
    selectedRoute: String,
    userProfile: UserProfile = UserProfile(),
    onSelectRoute: (String) -> Unit,
    onProfileClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .testTag("shadcn_sidebar")
            .padding(vertical = 16.dp, horizontal = 12.dp),
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        Column(
            modifier = Modifier
                .weight(1f)
                .verticalScroll(rememberScrollState())
        ) {
            // Workspace / Company Selector Card (Shadcn Popover trigger style)
            Surface(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(10.dp))
                    .border(width = 1.dp, color = Slate200, shape = RoundedCornerShape(10.dp))
                    .clickable { onProfileClick() },
                color = MaterialTheme.colorScheme.surface
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(10.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .size(34.dp)
                            .clip(RoundedCornerShape(8.dp))
                            .background(IndigoPrimary),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "EP",
                            color = Color.White,
                            fontWeight = FontWeight.Black,
                            fontSize = 13.sp
                        )
                    }

                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = "EMITIA S.A.",
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Bold,
                            color = Slate900,
                            maxLines = 1
                        )
                        Text(
                            text = "Plan Enterprise • ARS",
                            fontSize = 11.sp,
                            color = Slate400,
                            maxLines = 1
                        )
                    }

                    Icon(
                        Icons.Default.UnfoldMore,
                        contentDescription = "Cambiar Organización",
                        tint = Slate400,
                        modifier = Modifier.size(18.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Group 1: Plataforma
            Text(
                text = "PLATAFORMA",
                fontSize = 10.sp,
                fontWeight = FontWeight.Bold,
                letterSpacing = 1.2.sp,
                color = Slate400,
                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
            )

            NAV_ITEMS.filter { it.section == "Plataforma" }.forEach { item ->
                SidebarNavLink(
                    item = item,
                    isSelected = selectedRoute == item.route,
                    onClick = { onSelectRoute(item.route) }
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Group 2: Tesorería & Finanzas
            Text(
                text = "TESORERÍA & PAGOS",
                fontSize = 10.sp,
                fontWeight = FontWeight.Bold,
                letterSpacing = 1.2.sp,
                color = Slate400,
                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
            )

            NAV_ITEMS.filter { it.section == "Tesorería" }.forEach { item ->
                SidebarNavLink(
                    item = item,
                    isSelected = selectedRoute == item.route,
                    onClick = { onSelectRoute(item.route) }
                )
            }
        }

        // Sidebar Footer: User Profile Summary Widget
        Surface(
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = 12.dp)
                .clip(RoundedCornerShape(10.dp))
                .border(width = 1.dp, color = Slate200, shape = RoundedCornerShape(10.dp))
                .clickable { onProfileClick() }
                .testTag("sidebar_user_profile_widget"),
            color = Slate50
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(10.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                // User Avatar
                Box(
                    modifier = Modifier
                        .size(34.dp)
                        .clip(CircleShape)
                        .background(Color(0xFFEEF2FF))
                        .border(1.dp, IndigoLight.copy(alpha = 0.5f), CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = userProfile.avatarInitials,
                        color = IndigoPrimary,
                        fontWeight = FontWeight.Bold,
                        fontSize = 12.sp
                    )
                }

                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = userProfile.name,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = Slate900,
                        maxLines = 1
                    )
                    Text(
                        text = userProfile.email,
                        fontSize = 10.sp,
                        color = Slate600,
                        maxLines = 1
                    )
                }

                Icon(
                    Icons.Default.MoreVert,
                    contentDescription = "Opciones de usuario",
                    tint = Slate400,
                    modifier = Modifier.size(18.dp)
                )
            }
        }
    }
}

/**
 * Shadcn-style navigation link item for the sidebar
 */
@Composable
fun SidebarNavLink(
    item: NavItem,
    isSelected: Boolean,
    onClick: () -> Unit
) {
    val bg = if (isSelected) Color(0xFFF1F5F9) else Color.Transparent
    val contentColor = if (isSelected) Slate900 else Slate600
    val iconColor = if (isSelected) IndigoPrimary else Slate400

    Surface(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 2.dp)
            .clip(RoundedCornerShape(8.dp))
            .clickable(onClick = onClick)
            .testTag("sidebar_nav_${item.route}"),
        color = bg,
        shape = RoundedCornerShape(8.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 10.dp, vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            Icon(
                item.icon,
                contentDescription = item.label,
                tint = iconColor,
                modifier = Modifier.size(18.dp)
            )

            Text(
                text = item.label,
                fontSize = 13.sp,
                fontWeight = if (isSelected) FontWeight.SemiBold else FontWeight.Normal,
                color = contentColor,
                modifier = Modifier.weight(1f)
            )

            item.badge?.let { badge ->
                Surface(
                    shape = RoundedCornerShape(6.dp),
                    color = if (isSelected) Color(0xFFE2E8F0) else Color(0xFFEEF2FF)
                ) {
                    Text(
                        text = badge,
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        color = IndigoPrimary,
                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                    )
                }
            }
        }
    }
}

/**
 * Responsive Top Bar featuring:
 * - Sidebar trigger for mobile
 * - Route breadcrumbs
 * - Search bar placeholder with shortcut badge (⌘K)
 * - System status indicator
 * - Notification bell
 * - Prominent User Profile Summary component
 */
@Composable
fun ShadcnTopBar(
    selectedRoute: String,
    userProfile: UserProfile = UserProfile(),
    isMobile: Boolean,
    onOpenDrawer: () -> Unit,
    onSearchClick: () -> Unit,
    onNotificationClick: () -> Unit,
    onProfileClick: () -> Unit
) {
    val currentItem = NAV_ITEMS.find { it.route == selectedRoute }

    Surface(
        modifier = Modifier
            .fillMaxWidth()
            .border(width = 1.dp, color = Slate200)
            .testTag("shadcn_top_bar"),
        color = MaterialTheme.colorScheme.surface
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 10.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            // Left: Hamburger / Breadcrumbs
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                if (isMobile) {
                    IconButton(
                        onClick = onOpenDrawer,
                        modifier = Modifier
                            .size(36.dp)
                            .testTag("top_bar_menu_button")
                    ) {
                        Icon(Icons.Default.Menu, contentDescription = "Abrir Menú Lateral", tint = Slate700)
                    }
                }

                // Breadcrumb Path
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(4.dp)
                ) {
                    Text(
                        text = "Emitia Pay",
                        fontSize = 13.sp,
                        color = Slate400,
                        fontWeight = FontWeight.Medium
                    )
                    Text(
                        text = "/",
                        fontSize = 13.sp,
                        color = Slate300
                    )
                    Text(
                        text = currentItem?.label ?: "Dashboard",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold,
                        color = Slate900
                    )
                }
            }

            // Right: Search Trigger, Live Status, Notifications, and User Profile Summary
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                // Search Shortcut Bar (shadcn command prompt trigger)
                Surface(
                    modifier = Modifier
                        .clip(RoundedCornerShape(8.dp))
                        .border(1.dp, Slate200, RoundedCornerShape(8.dp))
                        .clickable(onClick = onSearchClick)
                        .testTag("top_bar_search"),
                    color = Slate50
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        Icon(Icons.Default.Search, contentDescription = "Buscar", tint = Slate400, modifier = Modifier.size(15.dp))
                        if (!isMobile) {
                            Text("Buscar...", fontSize = 12.sp, color = Slate400)
                            Surface(
                                shape = RoundedCornerShape(4.dp),
                                color = Slate200
                            ) {
                                Text(
                                    text = "⌘K",
                                    fontSize = 9.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Slate600,
                                    modifier = Modifier.padding(horizontal = 4.dp, vertical = 1.dp)
                                )
                            }
                        }
                    }
                }

                // System status badge (desktop only)
                if (!isMobile) {
                    Surface(
                        shape = RoundedCornerShape(20.dp),
                        color = EmeraldLight,
                        border = androidx.compose.foundation.BorderStroke(1.dp, EmeraldSuccess.copy(alpha = 0.3f))
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(4.dp)
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(6.dp)
                                    .clip(CircleShape)
                                    .background(EmeraldSuccess)
                            )
                            Text("BCRA / COELSA", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = EmeraldSuccess)
                        }
                    }
                }

                // Notifications Button with indicator dot
                Box {
                    IconButton(
                        onClick = onNotificationClick,
                        modifier = Modifier.size(36.dp).testTag("top_bar_notifications")
                    ) {
                        Icon(Icons.Default.NotificationsNone, contentDescription = "Notificaciones", tint = Slate700, modifier = Modifier.size(20.dp))
                    }
                    Box(
                        modifier = Modifier
                            .align(Alignment.TopEnd)
                            .padding(top = 6.dp, end = 6.dp)
                            .size(7.dp)
                            .clip(CircleShape)
                            .background(RoseError)
                    )
                }

                // Top Bar User Profile Summary Component
                Surface(
                    modifier = Modifier
                        .clip(RoundedCornerShape(20.dp))
                        .border(1.dp, Slate200, RoundedCornerShape(20.dp))
                        .clickable(onClick = onProfileClick)
                        .testTag("top_bar_user_profile_summary"),
                    color = Slate50
                ) {
                    Row(
                        modifier = Modifier.padding(start = 4.dp, end = 8.dp, top = 3.dp, bottom = 3.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        // User Avatar
                        Box(
                            modifier = Modifier
                                .size(28.dp)
                                .clip(CircleShape)
                                .background(IndigoPrimary),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(userProfile.avatarInitials, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 11.sp)
                        }

                        if (!isMobile) {
                            Column {
                                Text(userProfile.name, fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Slate900)
                                Text(userProfile.email, fontSize = 10.sp, color = Slate400)
                            }
                        }

                        Icon(Icons.Default.KeyboardArrowDown, contentDescription = "Perfil", tint = Slate400, modifier = Modifier.size(16.dp))
                    }
                }
            }
        }
    }
}

/**
 * Shadcn-inspired User Profile Popover / Dialog
 * Displays:
 * - User details (Avatar, Name, Email, CUIT, Role badge)
 * - Company details (EMITIA S.A., Banco Central status)
 * - Quick shortcuts (Cuentas, Tarjetas, Configuración)
 * - Sign out button
 */
@Composable
fun ShadcnUserProfileDialog(
    userProfile: UserProfile = UserProfile(),
    onDismiss: () -> Unit,
    onNavigate: (String) -> Unit,
    onLogout: () -> Unit = {}
) {
    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Box(
                    modifier = Modifier
                        .size(46.dp)
                        .clip(CircleShape)
                        .background(Color(0xFF4285F4)),
                    contentAlignment = Alignment.Center
                ) {
                    Text(userProfile.avatarInitials, color = Color.White, fontWeight = FontWeight.ExtraBold, fontSize = 18.sp)
                }

                Column(modifier = Modifier.weight(1f)) {
                    Text(userProfile.name, fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Slate900)
                    Text(userProfile.email, fontSize = 12.sp, color = Slate600)
                    Spacer(modifier = Modifier.height(3.dp))
                    Surface(
                        shape = RoundedCornerShape(4.dp),
                        color = Color(0xFFEEF2FF)
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(4.dp)
                        ) {
                            GoogleLogoIcon(modifier = Modifier.size(12.dp))
                            Text(
                                "Google Verificado",
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                color = IndigoPrimary
                            )
                        }
                    }
                }
            }
        },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Divider(color = Slate200)

                // Organization Summary Card
                Card(
                    colors = CardDefaults.cardColors(containerColor = Slate50),
                    shape = RoundedCornerShape(10.dp),
                    modifier = Modifier.border(1.dp, Slate200, RoundedCornerShape(10.dp))
                ) {
                    Column(
                        modifier = Modifier.padding(12.dp),
                        verticalArrangement = Arrangement.spacedBy(4.dp)
                    ) {
                        Text("EMPRESA TITULAR", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Slate400)
                        Text("EMITIA S.A.", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = Slate900)
                        Text("CUIT: 30-71829304-9", fontSize = 12.sp, color = Slate600)
                        Text("Cuenta Corriente Especial Homologada BCRA", fontSize = 11.sp, color = Slate600)
                    }
                }

                // Quick Navigation items in Profile
                Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                    Surface(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(8.dp))
                            .clickable { onNavigate("accounts") },
                        color = MaterialTheme.colorScheme.surface
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 8.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Icon(Icons.Default.AccountBalance, contentDescription = null, tint = IndigoPrimary, modifier = Modifier.size(18.dp))
                            Text("Mis Cuentas Bancarias & CBU", fontSize = 13.sp, color = Slate700, modifier = Modifier.weight(1f))
                            Icon(Icons.Default.ChevronRight, contentDescription = null, tint = Slate400, modifier = Modifier.size(16.dp))
                        }
                    }

                    Surface(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(8.dp))
                            .clickable { onNavigate("cards") },
                        color = MaterialTheme.colorScheme.surface
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 8.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Icon(Icons.Default.CreditCard, contentDescription = null, tint = IndigoPrimary, modifier = Modifier.size(18.dp))
                            Text("Tarjetas Corporativas Asignadas", fontSize = 13.sp, color = Slate700, modifier = Modifier.weight(1f))
                            Icon(Icons.Default.ChevronRight, contentDescription = null, tint = Slate400, modifier = Modifier.size(16.dp))
                        }
                    }
                }

                Divider(color = Slate200)

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text("Conexión COELSA:", fontSize = 12.sp, color = Slate600)
                    Surface(shape = RoundedCornerShape(4.dp), color = EmeraldLight) {
                        Text("EN LÍNEA", color = EmeraldSuccess, fontSize = 10.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp))
                    }
                }
            }
        },
        dismissButton = {
            OutlinedButton(
                onClick = onLogout,
                colors = ButtonDefaults.outlinedButtonColors(contentColor = RoseError),
                shape = RoundedCornerShape(8.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, RoseError.copy(alpha = 0.5f)),
                modifier = Modifier.testTag("btn_logout")
            ) {
                Icon(Icons.Default.Logout, contentDescription = null, modifier = Modifier.size(16.dp))
                Spacer(modifier = Modifier.width(6.dp))
                Text("Cerrar Sesión", fontWeight = FontWeight.SemiBold, fontSize = 12.sp)
            }
        },
        confirmButton = {
            Button(
                onClick = onDismiss,
                colors = ButtonDefaults.buttonColors(containerColor = Slate900),
                shape = RoundedCornerShape(8.dp)
            ) {
                Text("Listo", fontWeight = FontWeight.Bold)
            }
        }
    )
}

@Composable
fun ScreenContent(
    selectedTab: String,
    viewModel: EmitiaViewModel,
    onNavigate: (String) -> Unit
) {
    when (selectedTab) {
        "dashboard" -> DashboardScreen(viewModel = viewModel, onNavigate = onNavigate)
        "accounts" -> AccountsScreen(viewModel = viewModel, onNavigateTransfer = { onNavigate("transfers") })
        "transfers" -> TransfersScreen(viewModel = viewModel, onFinish = { onNavigate("dashboard") })
        "payments" -> PaymentsScreen(viewModel = viewModel)
        "collections" -> CollectionsScreen(viewModel = viewModel)
        "echeqs" -> ECheqsScreen(viewModel = viewModel)
        "investments" -> InvestmentsScreen(viewModel = viewModel)
        "cards" -> CardsScreen(viewModel = viewModel)
        else -> DashboardScreen(viewModel = viewModel, onNavigate = onNavigate)
    }
}



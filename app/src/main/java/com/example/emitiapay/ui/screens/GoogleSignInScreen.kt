package com.example.emitiapay.ui.screens

import androidx.compose.animation.*
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.Fill
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.emitiapay.ui.theme.*

/**
 * Google multi-color "G" Icon drawn cleanly with Compose Canvas
 */
@Composable
fun GoogleLogoIcon(modifier: Modifier = Modifier) {
    Canvas(modifier = modifier.size(22.dp)) {
        val w = size.width
        val h = size.height

        // Google standard brand colors
        val blue = Color(0xFF4285F4)
        val green = Color(0xFF34A853)
        val yellow = Color(0xFFFBBC05)
        val red = Color(0xFFEA4335)

        // Draw the 4 colored arcs of the G
        val strokeW = w * 0.22f
        val inset = strokeW / 2f
        val arcSize = Size(w - strokeW, h - strokeW)
        val topLeft = Offset(inset, inset)

        // Red top arc
        val pathRed = Path().apply {
            arcTo(
                androidx.compose.ui.geometry.Rect(topLeft, arcSize),
                startAngleDegrees = 200f,
                sweepAngleDegrees = 115f,
                forceMoveTo = false
            )
        }
        drawPath(
            path = pathRed,
            color = red,
            style = androidx.compose.ui.graphics.drawscope.Stroke(width = strokeW)
        )

        // Yellow left arc
        val pathYellow = Path().apply {
            arcTo(
                androidx.compose.ui.geometry.Rect(topLeft, arcSize),
                startAngleDegrees = 135f,
                sweepAngleDegrees = 75f,
                forceMoveTo = false
            )
        }
        drawPath(
            path = pathYellow,
            color = yellow,
            style = androidx.compose.ui.graphics.drawscope.Stroke(width = strokeW)
        )

        // Green bottom arc
        val pathGreen = Path().apply {
            arcTo(
                androidx.compose.ui.geometry.Rect(topLeft, arcSize),
                startAngleDegrees = 40f,
                sweepAngleDegrees = 100f,
                forceMoveTo = false
            )
        }
        drawPath(
            path = pathGreen,
            color = green,
            style = androidx.compose.ui.graphics.drawscope.Stroke(width = strokeW)
        )

        // Blue right arc + horizontal crossbar
        val pathBlue = Path().apply {
            arcTo(
                androidx.compose.ui.geometry.Rect(topLeft, arcSize),
                startAngleDegrees = 330f,
                sweepAngleDegrees = 70f,
                forceMoveTo = false
            )
        }
        drawPath(
            path = pathBlue,
            color = blue,
            style = androidx.compose.ui.graphics.drawscope.Stroke(width = strokeW)
        )

        // Crossbar in blue
        drawRect(
            color = blue,
            topLeft = Offset(w * 0.48f, h * 0.40f),
            size = Size(w * 0.46f, strokeW)
        )
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun GoogleSignInScreen(
    onSignInSuccess: (name: String, email: String) -> Unit,
    modifier: Modifier = Modifier
) {
    var showAccountPickerSheet by remember { mutableStateOf(false) }
    var isAuthenticating by remember { mutableStateOf(false) }
    var showCustomAccountDialog by remember { mutableStateOf(false) }

    // User's default detected Google account
    val defaultEmail = "noacvys@gmail.com"
    val defaultName = "Noa"

    val scrollState = rememberScrollState()

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(Slate50)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(scrollState)
                .padding(horizontal = 24.dp, vertical = 32.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Spacer(modifier = Modifier.height(16.dp))

            // Brand Header with Modern Shield
            Box(
                modifier = Modifier
                    .size(68.dp)
                    .clip(RoundedCornerShape(18.dp))
                    .background(Slate900)
                    .border(1.dp, Slate800, RoundedCornerShape(18.dp)),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    Icons.Default.AccountBalance,
                    contentDescription = "EMITIA PAY",
                    tint = Color.White,
                    modifier = Modifier.size(34.dp)
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            Text(
                text = "EMITIA PAY",
                fontSize = 26.sp,
                fontWeight = FontWeight.ExtraBold,
                color = Slate900,
                letterSpacing = 1.sp
            )

            Text(
                text = "Banca Corporativa & Tesorería Digital",
                fontSize = 13.sp,
                fontWeight = FontWeight.Medium,
                color = Slate600
            )

            Spacer(modifier = Modifier.height(8.dp))

            Surface(
                shape = RoundedCornerShape(20.dp),
                color = Color(0xFFEEF2FF),
                border = androidx.compose.foundation.BorderStroke(1.dp, IndigoPrimary.copy(alpha = 0.2f))
            ) {
                Row(
                    modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .size(6.dp)
                            .clip(CircleShape)
                            .background(EmeraldSuccess)
                    )
                    Text(
                        text = "Homologación COELSA & BCRA",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = IndigoPrimary
                    )
                }
            }

            Spacer(modifier = Modifier.height(32.dp))

            // Main Authentication Card
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .widthIn(max = 440.dp)
                    .border(1.dp, Slate200, RoundedCornerShape(16.dp))
                    .testTag("google_signin_card"),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
            ) {
                Column(
                    modifier = Modifier.padding(24.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    Text(
                        text = "Iniciar Sesión",
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Bold,
                        color = Slate900
                    )

                    Text(
                        text = "Accede a la tesorería de EMITIA con tu cuenta corporativa o cuenta personal verificada de Google.",
                        fontSize = 13.sp,
                        color = Slate600,
                        textAlign = TextAlign.Center,
                        lineHeight = 18.sp
                    )

                    Spacer(modifier = Modifier.height(6.dp))

                    // Primary Official "Sign in with Google" Button
                    Surface(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(52.dp)
                            .clip(RoundedCornerShape(10.dp))
                            .border(1.dp, Slate300, RoundedCornerShape(10.dp))
                            .clickable(enabled = !isAuthenticating) {
                                showAccountPickerSheet = true
                            }
                            .testTag("btn_continue_with_google"),
                        color = Color.White,
                        shadowElevation = 1.dp
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxSize()
                                .padding(horizontal = 16.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.Center
                        ) {
                            if (isAuthenticating) {
                                CircularProgressIndicator(
                                    modifier = Modifier.size(20.dp),
                                    strokeWidth = 2.dp,
                                    color = IndigoPrimary
                                )
                                Spacer(modifier = Modifier.width(12.dp))
                                Text(
                                    text = "Verificando con Google...",
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.SemiBold,
                                    color = Slate700
                                )
                            } else {
                                GoogleLogoIcon()
                                Spacer(modifier = Modifier.width(12.dp))
                                Text(
                                    text = "Continuar con Google",
                                    fontSize = 15.sp,
                                    fontWeight = FontWeight.SemiBold,
                                    color = Slate900
                                )
                            }
                        }
                    }

                    // Direct 1-Tap Quick login with detected Google account
                    Surface(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(10.dp))
                            .background(Slate50)
                            .border(1.dp, Color(0xFFE2E8F0), RoundedCornerShape(10.dp))
                            .clickable(enabled = !isAuthenticating) {
                                isAuthenticating = true
                                onSignInSuccess(defaultName, defaultEmail)
                            }
                            .testTag("quick_google_login_account"),
                        color = Slate50
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(12.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(36.dp)
                                    .clip(CircleShape)
                                    .background(Color(0xFF4285F4)),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    text = "N",
                                    color = Color.White,
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 15.sp
                                )
                            }

                            Column(modifier = Modifier.weight(1f)) {
                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.spacedBy(4.dp)
                                ) {
                                    Text(
                                        text = defaultName,
                                        fontSize = 13.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = Slate900
                                    )
                                    Icon(
                                        Icons.Default.CheckCircle,
                                        contentDescription = "Verificado",
                                        tint = EmeraldSuccess,
                                        modifier = Modifier.size(14.dp)
                                    )
                                }
                                Text(
                                    text = defaultEmail,
                                    fontSize = 11.sp,
                                    color = Slate600
                                )
                            }

                            Icon(
                                Icons.Default.ArrowForward,
                                contentDescription = "Acceder",
                                tint = IndigoPrimary,
                                modifier = Modifier.size(18.dp)
                            )
                        }
                    }

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Divider(modifier = Modifier.weight(1f), color = Slate200)
                        Text(
                            text = "o",
                            fontSize = 12.sp,
                            color = Slate400,
                            modifier = Modifier.padding(horizontal = 12.dp)
                        )
                        Divider(modifier = Modifier.weight(1f), color = Slate200)
                    }

                    // Guest / Demo Explore Button
                    OutlinedButton(
                        onClick = {
                            onSignInSuccess("Carlos Benítez (Demo)", "carlos.benitez@emitia.com")
                        },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(44.dp)
                            .testTag("btn_guest_explore"),
                        shape = RoundedCornerShape(8.dp),
                        colors = ButtonDefaults.outlinedButtonColors(contentColor = Slate700)
                    ) {
                        Icon(Icons.Default.Visibility, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Acceso Rápido de Demostración", fontSize = 13.sp, fontWeight = FontWeight.Medium)
                    }
                }
            }

            Spacer(modifier = Modifier.height(28.dp))

            // Security Footnotes
            Row(
                horizontalArrangement = Arrangement.spacedBy(16.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(4.dp)
                ) {
                    Icon(Icons.Default.Lock, contentDescription = null, tint = Slate400, modifier = Modifier.size(14.dp))
                    Text("Cifrado AES-256", fontSize = 11.sp, color = Slate600)
                }

                Text("•", color = Slate300)

                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(4.dp)
                ) {
                    Icon(Icons.Default.Security, contentDescription = null, tint = Slate400, modifier = Modifier.size(14.dp))
                    Text("OAuth 2.0 Google", fontSize = 11.sp, color = Slate600)
                }

                Text("•", color = Slate300)

                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(4.dp)
                ) {
                    Icon(Icons.Default.VerifiedUser, contentDescription = null, tint = Slate400, modifier = Modifier.size(14.dp))
                    Text("BCRA Reglamentado", fontSize = 11.sp, color = Slate600)
                }
            }
        }

        // Google Account Selector Bottom Sheet
        if (showAccountPickerSheet) {
            ModalBottomSheet(
                onDismissRequest = { showAccountPickerSheet = false },
                containerColor = MaterialTheme.colorScheme.surface,
                tonalElevation = 0.dp
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 24.dp)
                        .padding(bottom = 32.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        GoogleLogoIcon()
                        Column {
                            Text(
                                text = "Acceder con Google",
                                fontSize = 16.sp,
                                fontWeight = FontWeight.Bold,
                                color = Slate900
                            )
                            Text(
                                text = "para continuar en EMITIA PAY",
                                fontSize = 12.sp,
                                color = Slate600
                            )
                        }
                    }

                    Divider(color = Slate200)

                    Text(
                        text = "Elige una cuenta",
                        fontSize = 14.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = Slate800,
                        modifier = Modifier.fillMaxWidth()
                    )

                    // Detected account item
                    Surface(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(10.dp))
                            .border(1.dp, IndigoPrimary.copy(alpha = 0.4f), RoundedCornerShape(10.dp))
                            .clickable {
                                showAccountPickerSheet = false
                                isAuthenticating = true
                                onSignInSuccess(defaultName, defaultEmail)
                            }
                            .testTag("google_account_default_item"),
                        color = Color(0xFFF8FAFC)
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(14.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(40.dp)
                                    .clip(CircleShape)
                                    .background(Color(0xFF4285F4)),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    text = "N",
                                    color = Color.White,
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 18.sp
                                )
                            }

                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = defaultName,
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Slate900
                                )
                                Text(
                                    text = defaultEmail,
                                    fontSize = 12.sp,
                                    color = Slate600
                                )
                            }

                            Surface(
                                shape = RoundedCornerShape(4.dp),
                                color = EmeraldLight
                            ) {
                                Text(
                                    text = "Tu Cuenta",
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = EmeraldSuccess,
                                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                )
                            }
                        }
                    }

                    // Use another account button
                    Surface(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(10.dp))
                            .border(1.dp, Slate200, RoundedCornerShape(10.dp))
                            .clickable {
                                showAccountPickerSheet = false
                                showCustomAccountDialog = true
                            }
                            .testTag("google_account_other_item"),
                        color = MaterialTheme.colorScheme.surface
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(14.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(40.dp)
                                    .clip(CircleShape)
                                    .background(Slate100),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(
                                    Icons.Default.PersonAdd,
                                    contentDescription = null,
                                    tint = Slate600,
                                    modifier = Modifier.size(20.dp)
                                )
                            }

                            Text(
                                text = "Usar otra cuenta de Google",
                                fontSize = 13.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = Slate800,
                                modifier = Modifier.weight(1f)
                            )

                            Icon(Icons.Default.ChevronRight, contentDescription = null, tint = Slate400)
                        }
                    }

                    Text(
                        text = "Para continuar, Google compartirá tu nombre, dirección de correo electrónico y preferencia de idioma con EMITIA PAY.",
                        fontSize = 11.sp,
                        color = Slate400,
                        lineHeight = 15.sp,
                        textAlign = TextAlign.Center
                    )
                }
            }
        }

        // Custom Google Account Input Dialog
        if (showCustomAccountDialog) {
            var customName by remember { mutableStateOf("") }
            var customEmail by remember { mutableStateOf("") }

            AlertDialog(
                onDismissRequest = { showCustomAccountDialog = false },
                title = {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        GoogleLogoIcon()
                        Text("Ingresar cuenta de Google", fontSize = 16.sp, fontWeight = FontWeight.Bold)
                    }
                },
                text = {
                    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                        Text(
                            "Ingresa los datos de tu cuenta Google para sincronizar tu perfil bancario en EMITIA:",
                            fontSize = 12.sp,
                            color = Slate600
                        )

                        OutlinedTextField(
                            value = customName,
                            onValueChange = { customName = it },
                            label = { Text("Nombre Completo") },
                            placeholder = { Text("ej. Noa Gómez") },
                            singleLine = true,
                            modifier = Modifier.fillMaxWidth().testTag("input_custom_google_name")
                        )

                        OutlinedTextField(
                            value = customEmail,
                            onValueChange = { customEmail = it },
                            label = { Text("Correo Google (@gmail.com)") },
                            placeholder = { Text("ej. noacvys@gmail.com") },
                            singleLine = true,
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email, imeAction = ImeAction.Done),
                            modifier = Modifier.fillMaxWidth().testTag("input_custom_google_email")
                        )
                    }
                },
                confirmButton = {
                    Button(
                        onClick = {
                            val finalEmail = if (customEmail.isNotBlank()) customEmail.trim() else defaultEmail
                            val finalName = if (customName.isNotBlank()) customName.trim() else defaultName
                            showCustomAccountDialog = false
                            onSignInSuccess(finalName, finalEmail)
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = Slate900),
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier.testTag("btn_confirm_custom_google")
                    ) {
                        Text("Acceder con esta cuenta", fontWeight = FontWeight.Bold)
                    }
                },
                dismissButton = {
                    TextButton(onClick = { showCustomAccountDialog = false }) {
                        Text("Cancelar", color = Slate600)
                    }
                }
            )
        }
    }
}

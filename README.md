# EMITIA PAY - Android Application

Plataforma corporativa de gestión financiera B2B desarrollada en Kotlin y Jetpack Compose con Material Design 3.

## Características Principales

- **Dashboard Financiero**: Visualización consolidada de saldos en Pesos (ARS) y Dólares (USD), cotización MEP de referencia, métricas de flujo de caja y movimientos recientes.
- **Gestión de Cuentas**: Consulta de cuentas corporativas (sueldos, remuneradas, operativas y en dólares) con CBU, Alias y copiado rápido.
- **Transferencias**:
  - Transferencias inmediatas entre cuentas propias con cotización de divisas en tiempo real.
  - Transferencias a terceros y proveedores mediante CBU o Alias.
- **Pagos a Proveedores y Servicios**: Programación, aprobación y auditoría de pagos con control de estado (Borrador, Programado, Completado).
- **Cobranzas y Facturación**:
  - Emisión y seguimiento de cobranzas B2B.
  - Generación de códigos QR interoperables (Transferencias 3.0).
- **Cheques Electrónicos (eCheqs)**: Emisión, custodia y depósito inmediato de eCheqs con validación COELSA.
- **Inversiones y Rendimientos**: Suscripción a Fondos Comunes de Inversión (FCI Money Market T+0), Plazos Fijos tradicionales y Bonos con simulador de rendimiento.
- **Tarjetas Corporativas**: Emisión de tarjetas virtuales y físicas con control de límites de gasto, reveal de CVV y congelamiento instantáneo.

## Arquitectura Técnica

- **Lenguaje**: Kotlin 2.1
- **UI Toolkit**: Jetpack Compose con Material 3 (Scaffold, NavigationRail, NavigationBar adaptativo)
- **Persistencia Local**: Room Database con soporte offline y precarga de datos
- **Patrón de Diseño**: Model-View-ViewModel (MVVM) con Kotlin Coroutines y StateFlow
- **Build System**: Gradle Kotlin DSL con Version Catalog (`libs.versions.toml`)


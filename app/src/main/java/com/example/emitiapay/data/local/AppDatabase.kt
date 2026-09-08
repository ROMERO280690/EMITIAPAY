package com.example.emitiapay.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.sqlite.db.SupportSQLiteDatabase
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

@Database(
    entities = [
        AccountEntity::class,
        TransactionEntity::class,
        PaymentEntity::class,
        CollectionEntity::class,
        ECheqEntity::class,
        InvestmentEntity::class,
        CardEntity::class,
        ContactEntity::class
    ],
    version = 1,
    exportSchema = false
)
abstract class AppDatabase : RoomDatabase() {
    abstract fun accountDao(): AccountDao
    abstract fun transactionDao(): TransactionDao
    abstract fun paymentDao(): PaymentDao
    abstract fun collectionDao(): CollectionDao
    abstract fun eCheqDao(): ECheqDao
    abstract fun investmentDao(): InvestmentDao
    abstract fun cardDao(): CardDao
    abstract fun contactDao(): ContactDao

    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null

        fun getDatabase(context: Context): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "emitia_pay.db"
                ).addCallback(object : Callback() {
                    override fun onCreate(db: SupportSQLiteDatabase) {
                        super.onCreate(db)
                        CoroutineScope(Dispatchers.IO).launch {
                            seedInitialData(getDatabase(context))
                        }
                    }
                }).build()
                INSTANCE = instance
                instance
            }
        }

        private suspend fun seedInitialData(database: AppDatabase) {
            val accounts = listOf(
                AccountEntity("acc_1", "Cuenta Sueldos", "ARS", 2500000.0, "0123456789012345678901", "MI.ALIAS.SUELDOS", "corriente", "active"),
                AccountEntity("acc_2", "Cuenta Inversiones", "ARS", 5000000.0, "0123456789012345678902", "MI.ALIAS.INVERSION", "remunerada", "active"),
                AccountEntity("acc_3", "Cuenta Dólares", "USD", 15000.0, "0123456789012345678903", "MI.ALIAS.DOLARES", "corriente", "active")
            )
            database.accountDao().insertAll(accounts)

            val contacts = listOf(
                ContactEntity("c_1", "Tech Solutions SRL", "30-71234567-8", "0123456789012345678904", "tech.solutions", "Banco Galicia", "contacto@techsolutions.com", "proveedores"),
                ContactEntity("c_2", "Estudio Contable Gómez", "30-65432109-1", "0123456789012345678905", "estudio.gomez", "BBVA", "info@estudiogomez.com", "servicios"),
                ContactEntity("c_3", "Distribuidora Norte", "30-98765432-2", "0123456789012345678906", "distribuidora.norte", "Santander", "ventas@distribuidoranorte.com", "proveedores"),
                ContactEntity("c_4", "Cliente ABC SA", "30-11223344-3", "0123456789012345678907", "cliente.abc", "Banco Macro", "compras@clienteabc.com", "clientes")
            )
            database.contactDao().insertAll(contacts)

            val transactions = listOf(
                TransactionEntity("tx_1", "transfer_in", 1000000.0, "ARS", "Transferencia recibida", "Cliente ABC SA", "30-11223344-3", "ventas", "completed", "acc_1", "REF001", "Hoy"),
                TransactionEntity("tx_2", "transfer_out", 250000.0, "ARS", "Pago a proveedor", "Tech Solutions SRL", "30-71234567-8", "proveedores", "completed", "acc_1", "REF002", "Ayer"),
                TransactionEntity("tx_3", "payment", 150000.0, "ARS", "Pago de servicios", "EDENOR", "30-55667788-9", "servicios", "completed", "acc_1", "REF003", "Hace 2 días"),
                TransactionEntity("tx_4", "collection", 500000.0, "ARS", "Cobro de factura", "Cliente XYZ SRL", "30-55667788-4", "ventas", "completed", "acc_1", "REF004", "Hace 3 días"),
                TransactionEntity("tx_5", "yield", 25000.0, "ARS", "Rendimiento FCI Money Market", "Banco Galicia", "", "rendimientos", "completed", "acc_2", "REF005", "Hace 4 días"),
                TransactionEntity("tx_6", "transfer_in", 500.0, "USD", "Transferencia USD Comercio Exterior", "Exportadora Sur", "30-99887766-1", "ventas", "completed", "acc_3", "REF007", "Hace 5 días")
            )
            database.transactionDao().insertAll(transactions)

            val payments = listOf(
                PaymentEntity("pay_1", "Tech Solutions SRL", "30-71234567-8", "0123456789012345678904", 150000.0, "ARS", "Pago servicios IT", "proveedores", "2026-07-02", "draft"),
                PaymentEntity("pay_2", "Estudio Contable Gómez", "30-65432109-1", "0123456789012345678905", 85000.0, "ARS", "Honorarios mensuales", "servicios", "2026-07-04", "scheduled"),
                PaymentEntity("pay_3", "Distribuidora Norte", "30-98765432-2", "0123456789012345678906", 320000.0, "ARS", "Compra mercadería stock", "proveedores", "2026-07-05", "scheduled")
            )
            database.paymentDao().insertAll(payments)

            val collections = listOf(
                CollectionEntity("col_1", "Cliente ABC SA", "compras@clienteabc.com", 450000.0, "ARS", "Factura A-0001-1234", "FC-0001-1234", "2026-07-10", "pending"),
                CollectionEntity("col_2", "Cliente XYZ SRL", "admin@clientexyz.com", 275000.0, "ARS", "Factura A-0001-1235", "FC-0001-1235", "2026-07-15", "sent"),
                CollectionEntity("col_3", "Mayorista del Sur", "ventas@mayoristasur.com", 680000.0, "ARS", "Factura A-0001-1236", "FC-0001-1236", "2026-06-30", "overdue")
            )
            database.collectionDao().insertAll(collections)

            val echeqs = listOf(
                ECheqEntity("ech_1", "ECH-00048291", 450000.0, "ARS", "Distribuidora Norte", "30-98765432-2", "Pago factura 8921", "2026-06-15", "2026-07-15", "emitido"),
                ECheqEntity("ech_2", "ECH-00048292", 720000.0, "ARS", "Logística Express SA", "30-77889900-1", "Flete internacional", "2026-06-20", "2026-07-20", "pendiente"),
                ECheqEntity("ech_3", "ECH-00048105", 350000.0, "ARS", "Tech Solutions SRL", "30-71234567-8", "Servicios de nube", "2026-06-01", "2026-06-30", "depositado")
            )
            database.eCheqDao().insertAll(echeqs)

            val cards = listOf(
                CardEntity("card_1", "EMPRESA TITULAR", "•••• •••• •••• 4821", "virtual", "credit", "ARS", 1500000.0, 420000.0, "active", "08/28", "312"),
                CardEntity("card_2", "GERENCIA GENERAL", "•••• •••• •••• 9904", "physical", "debit", "USD", 5000.0, 1250.0, "active", "11/27", "844"),
                CardEntity("card_3", "MARKETING DIGITAL", "•••• •••• •••• 1729", "virtual", "credit", "ARS", 800000.0, 310000.0, "frozen", "04/29", "519")
            )
            database.cardDao().insertAll(cards)

            val investments = listOf(
                InvestmentEntity("inv_1", "fci", "Fondo Fima Money Market Clase A", 2000000.0, "ARS", 0.42, 30, 69041.0, "active"),
                InvestmentEntity("inv_2", "plazo_fijo", "Plazo Fijo Tradicional BANCOR", 1500000.0, "ARS", 0.386, 60, 95178.0, "active")
            )
            database.investmentDao().insertAll(investments)
        }
    }
}

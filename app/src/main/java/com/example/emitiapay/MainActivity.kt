package com.example.emitiapay

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import com.example.emitiapay.ui.screens.MainScreen
import com.example.emitiapay.ui.theme.EmitiaTheme
import com.example.emitiapay.ui.viewmodel.EmitiaViewModel

class MainActivity : ComponentActivity() {
    private val viewModel: EmitiaViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            EmitiaTheme {
                MainScreen(viewModel = viewModel)
            }
        }
    }
}

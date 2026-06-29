import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { CartProvider } from './context/CartContext.jsx' // <--- 1. Import the provider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. Wrap the App with CartProvider */}
    <CartProvider>
      <App />
    </CartProvider>
  </React.StrictMode>,
)
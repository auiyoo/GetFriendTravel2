import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: { fontFamily: 'Sarabun', fontSize: '15px' },
          success: { iconTheme: { primary: '#0ea5e9', secondary: 'white' } }
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
)

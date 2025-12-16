import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ToastContainer } from 'react-toastify'
import { AuthProvider } from '@/contexts/AuthContext'
import 'react-toastify/dist/ReactToastify.css'
import '@/index.css'
import App from './App'

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the root element');
}

createRoot(rootElement).render(
  <StrictMode>
    
      <AuthProvider>
        <App />
        <ToastContainer 
          
          autoClose={3000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
        />
      </AuthProvider>
    
  </StrictMode>,
)

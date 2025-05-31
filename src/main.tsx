import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ToastProvider } from './contexts/ToastContext';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Store } from './redux/Store.ts';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <BrowserRouter>
       <Provider store={Store}>
         <ToastProvider>
           <App />
         </ToastProvider>
       </Provider>
    </BrowserRouter>
  </StrictMode>,
)

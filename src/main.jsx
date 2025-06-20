// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// eslint-disable-next-line no-unused-vars
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
   <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>

);
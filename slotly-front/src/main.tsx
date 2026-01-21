import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Importe os estilos globais
import './index.css'

// Importe a árvore de rotas gerada automaticamente
import { routeTree } from './routeTree.gen'

// 1. Crie o Query Client
const queryClient = new QueryClient()

// 2. Crie a instância do Router
const router = createRouter({ routeTree })

// Registre o router para type-safety global
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// 3. Renderize tudo
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StrictMode>,
  )
}
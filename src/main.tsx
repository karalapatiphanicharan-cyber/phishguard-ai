import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import LoadingScreen from './components/LoadingScreen'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LoadingScreen>
      <RouterProvider router={router} />
    </LoadingScreen>
  </React.StrictMode>,
)

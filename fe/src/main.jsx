import './index.css'
import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router-dom"
import Cookies from 'js-cookie'
import HomePage from './pages/home'
import LoginPage from './pages/login'
import FeedPage from './pages/feed'

const ProtectedRoutes = () => {
  const xsrfToken = Cookies.get('XSRF-TOKEN');
  return xsrfToken ? <Outlet /> : <Navigate to="/login" />
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoutes />,
    children: [
      {
        path: '/feed',
        element: <FeedPage />,
      },
    ]
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

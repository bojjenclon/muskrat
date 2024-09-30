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
import { fetchAuth } from '@/utils/common'
import { baseStore } from '@/data/store'

const ProtectedRoutes = () => {
  const xsrfToken = Cookies.get('XSRF-TOKEN')
  const hasToken = !!xsrfToken

  if (hasToken) {
    const fetchUser = async () => {
      const res = await fetchAuth(`${location.origin}/api/users/current`, {
        method: 'GET'
      })

      if (res.ok) {
        const data = await res.json()
        baseStore.login(data)
      }
    }
    
    fetchUser()
      .catch((err) => {
        console.error(err)
      })
  } else {
    baseStore.logout()
  }

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
        path: '/feed/:feedId?',
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

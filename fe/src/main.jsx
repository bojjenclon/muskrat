import './index.css'
import React, { StrictMode, useState } from 'react'
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
import RegisterPage from './pages/register'

const ProtectedRoutes = () => {
  const [isReady, setIsReady] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

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
        setIsLoggedIn(true)
      }
    }
    
    fetchUser()
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        setIsReady(true)
      })
  } else {
    baseStore.logout()
    setIsReady(true)
  }

  if (!isReady) {
    return <></>
  }

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" />
}

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    element: <ProtectedRoutes />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
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

import React, { useCallback } from 'react'
import Cookies from 'js-cookie'
import { Layout } from '@/layout'
import { useNavigate } from 'react-router-dom'
import { fetchAuth } from '@/utils/common'
import { baseStore } from '@/data/store'

const HomePage = () => {
  const navigate = useNavigate()

  const isLoggedIn = baseStore.useStore((state) => state.loggedIn)

  const onRegister = useCallback(() => {
    fetch(`${location.origin}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'admin',
        password: 'admin'
      })
    })
      .then((res) => {
        if (res.status === 200) {
          console.log('Registered')
        }
      })
      .catch((err) => {
        console.error(err)
      })
  }, []);

  const onLogout = useCallback(() => {
    fetchAuth(`${location.origin}/api/auth/logout`, {
      method: 'POST'
    })
      .then((res) => {
        if (res.status === 200) {
          Cookies.remove('XSRF-TOKEN')
          baseStore.logout()
        }
      })
      .catch((err) => {
        console.error(err)
      })
  }, []);

  return (
    <Layout>
      <div className='mt-16 flex gap-6'>
        {!isLoggedIn && <button onClick={() => navigate('/login')}>Login</button>}
        {!isLoggedIn && <button onClick={onRegister}>Register</button>}
        {isLoggedIn && <button onClick={onLogout}>Logout</button>}
      </div>
    </Layout>
  )
}

export default HomePage

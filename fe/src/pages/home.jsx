import React, { useCallback } from 'react'
import Cookies from 'js-cookie'
import { Layout } from '@/layout'
import { useNavigate } from 'react-router-dom'
import { fetchAuth } from '@/utils/common'
import { baseStore } from '@/data/store'

const HomePage = () => {
  const navigate = useNavigate()

  const isLoggedIn = baseStore.useStore((state) => state.loggedIn)

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
        {!isLoggedIn && <button onClick={() => navigate('/register')}>Register</button>}
        {isLoggedIn && <button onClick={onLogout}>Logout</button>}
      </div>
    </Layout>
  )
}

export default HomePage

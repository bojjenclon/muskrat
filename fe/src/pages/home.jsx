import React, { useCallback } from 'react'
import Cookies from 'js-cookie'
import { Button } from '@headlessui/react'
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
        {!isLoggedIn && <Button onClick={() => navigate('/login')}>Login</Button>}
        {!isLoggedIn && <Button onClick={() => navigate('/register')}>Register</Button>}
        {isLoggedIn && <Button onClick={onLogout}>Logout</Button>}
      </div>
    </Layout>
  )
}

export default HomePage

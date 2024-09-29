import React, { useCallback, useEffect } from 'react'
import Muskrat from '@/assets/muskrat.svg?react'
import Cookies from 'js-cookie'
import { Layout } from '@/layout'
import { useNavigate } from 'react-router-dom'
import { fetchAuth } from '@/utils/common'
import { baseStore } from '@/data/store'

const HomePage = () => {
  const navigate = useNavigate()

  const xsrfToken = Cookies.get('XSRF-TOKEN')
  const isLoggedIn = baseStore.useStore((state) => state.loggedIn)
  
  useEffect(() => {
    const hasToken = !!xsrfToken
    if (hasToken) {
      fetchAuth(`${location.origin}/api/users/current`, {
        method: 'GET'
      })
        .then((res) => res.json()
        .then((data) => {
          baseStore.login(data)
        }))
        .catch((err) => {
          console.error(err)
        })
    } else {
      baseStore.logout()
    }
  }, [xsrfToken]);

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

  const onPost = useCallback(() => {
    fetchAuth(`${location.origin}/api/posts/new`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: 'Lorem ipsum'
      })
    })
      .then((res) => {
        if (res.status === 200) {
          console.log('posted')
        }
      })
      .catch((err) => {
        console.error(err)
      })
  }, []);

  return (
    <Layout>
      <div className='font-bold underline'>
        <Muskrat className="h-48 w-48" />

        Testing tailwind
      </div>
      <div className='flex gap-6'>
        <button onClick={() => navigate('/login')}>Login</button>
        <button onClick={onRegister}>Register</button>
        <button onClick={onLogout}>Logout</button>
      </div>
      {isLoggedIn && (
        <div className='flex gap-6 mt-4'>
          <button onClick={() => navigate('/feed')}>Feed</button>
          <button onClick={onPost}>Post</button>
        </div>
      )}
    </Layout>
  )
}

export default HomePage

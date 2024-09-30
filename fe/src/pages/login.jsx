import React from 'react'
import { useForm } from 'react-hook-form'
import { Button, Label, TextInput } from 'flowbite-react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import Layout from '@/layout'

const LoginPage = () => {
  const { register, handleSubmit } = useForm()
  const navigate = useNavigate();

  const onSubmit = (data) => {
    fetch(`${location.origin}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(async (res) => (res.json()))
      .then(({ token, expiresIn }) => {
        Cookies.set('XSRF-TOKEN', token, { expires: expiresIn })
        navigate('/')
      });
  }

  return (
    <Layout hideSidebar>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='flex flex-col gap-[20px]'>
          <div className='flex flex-col gap-[4px]'>
            <div className='block'>
              <Label htmlFor='username' value='Username' />
            </div>
            <TextInput id='username' defaultValue='admin' {...register('username', { required: true })} />
          </div>

          <div className='flex flex-col gap-[4px]'>
            <div className='block'>
              <Label htmlFor='password' value='Password' />
            </div>
            <TextInput id='password' type='password' defaultValue='admin' {...register('password', { required: true })} />
          </div>
          
          <Button type='submit'>Submit</Button>
        </div>
      </form>
    </Layout>
  )
}

export default LoginPage

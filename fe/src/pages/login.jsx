import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import { Button, Input, Label, Field } from '@headlessui/react'
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
      <form className='w-1/2 mx-auto mt-[48px]' onSubmit={handleSubmit(onSubmit)}>
        <div className='flex flex-col gap-[20px]'>
          <Field className='flex flex-col gap-[4px]'>
            <Label className='font-bold mt-[4px] mb-[2px]'>Username</Label>
            <Input
              className='p-[12px] bg-slate-900 text-white border border-slate-600 rounded-md'
              defaultValue='admin'
              {...register('username', { required: true })}
            />
          </Field>

          <Field className='flex flex-col gap-[4px]'>
            <Label className='font-bold mt-[4px] mb-[2px]'>Password</Label>
            <Input
              className='p-[12px] bg-slate-900 text-white border border-slate-600 rounded-md'
              type='password'
              defaultValue='admin'
              {...register('password', { required: true })}
            />
          </Field>
          
          <div className='flex justify-end'>
            <Button
              className='py-[8px] px-[24px] bg-emerald-950 border border-emerald-900 rounded-md'
              type='submit'
            >
              Login
            </Button>
          </div>
        </div>
      </form>
    </Layout>
  )
}

export default LoginPage

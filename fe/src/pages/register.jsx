import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Button, Input, Label, Field } from '@headlessui/react'
import Layout from '@/layout'

const RegisterPage = () => {
  const { register, handleSubmit } = useForm()
  const navigate = useNavigate();

  const onSubmit = (data) => {
    fetch(`${location.origin}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
      .then((res) => {
        if (res.status === 200) {
          navigate('/login')
        }
      })
      .catch((err) => {
        console.error(err)
      })
  }

  return (
    <Layout hideSidebar>
      <form className='w-1/2 mx-auto mt-[48px]' onSubmit={handleSubmit(onSubmit)}>
        <div className='flex flex-col gap-[20px]'>
          <Field className='flex flex-col gap-[4px]'>
            <Label className='font-bold mt-[4px] mb-[2px]' htmlFor='username'>Username</Label>
            <Input
              id='username'
              className='p-[12px] bg-slate-900 text-white border border-slate-600 rounded-md'
              {...register('username', { required: true })}
            />
          </Field>

          <Field className='flex flex-col gap-[4px]'>
            <Label className='font-bold mt-[4px] mb-[2px]' htmlFor='password'>Password</Label>
            <Input
              id='password'
              className='p-[12px] bg-slate-900 text-white border border-slate-600 rounded-md'
              type='password'
              {...register('password', { required: true })}
            />
          </Field>
          
          <div className='flex justify-end'>
            <Button
              className='py-[8px] px-[24px] bg-emerald-950 border border-emerald-900 rounded-md'
              type='submit'
            >
              Register
            </Button>
          </div>
        </div>
      </form>
    </Layout>
  )
}

export default RegisterPage

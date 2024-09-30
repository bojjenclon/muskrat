import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'
import { TbHome, TbHomeFilled, TbBell, TbBellFilled, TbUser, TbUserFilled, TbDots, TbDotsCircleHorizontal } from 'react-icons/tb'
import Muskrat from '@/assets/muskrat.svg?react'
import { baseStore } from '@/data/store'

export const Layout = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { pathname } = location

  const currentUser = baseStore.useStore((state) => state.user)

  return (
    <div className='w-screen h-screen flex justify-center pb-[10px] bg-black text-white overflow-hidden'>
      <header className='flex-grow h-full flex justify-end'>
        <div className='ml-[60px] w-[275px]'>
          <div className='flex flex-col gap-[6px] h-full px-[8px]'>
            <button onClick={() => navigate('/')}>
              <Muskrat className="h-[64px] w-[64px] p-2 fill-[#f0f0f0] hover:bg-zinc-900 hover:rounded-full hover:cursor-pointer" />
            </button>

            <button
              className={
                'flex items-center gap-[14px] pl-3 pr-6 py-2 self-start text-xl hover:bg-zinc-900 hover:rounded-full hover:cursor-pointer'
                  .concat(pathname === '/' ? ' font-bold' : '')
              }
              onClick={() => navigate('/')}
            >
              {pathname === '/' ? <TbHomeFilled className="h-[28px] w-[28px]" /> : <TbHome className="h-[28px] w-[28px]" />}
              <span>Home</span>
            </button>

            <button
              className={
                'flex items-center gap-[14px] pl-3 pr-6 py-2 self-start text-xl hover:bg-zinc-900 hover:rounded-full hover:cursor-pointer'
              }
              onClick={() => navigate('/')}
            >
              <TbBell className="h-[28px] w-[28px]" />
              <span>Notifications</span>
            </button>

            <button
              className={
                'flex items-center gap-[14px] pl-3 pr-6 py-2 self-start text-xl hover:bg-zinc-900 hover:rounded-full hover:cursor-pointer'
                  .concat(pathname === '/feed' ? ' font-bold' : '')
              }
              onClick={() => navigate('/feed')}
            >
              {pathname === '/feed' ? <TbUserFilled className="h-[28px] w-[28px]" /> : <TbUser className="h-[28px] w-[28px]" />}
              <span>Profile</span>
            </button>

            <button
              className={
                'flex items-center gap-[14px] pl-3 pr-6 py-2 self-start text-xl hover:bg-zinc-900 hover:rounded-full hover:cursor-pointer'
              }
              onClick={() => navigate('/')}
            >
              <TbDotsCircleHorizontal className="h-[28px] w-[28px]" />
              <span>More</span>
            </button>

            <div className='flex-1'></div>

            <button
              className='flex items-center gap-[14px] px-3 py-2 hover:bg-zinc-900 hover:rounded-full hover:cursor-pointer'
              onClick={() => navigate('/feed')}
            >
              <span className='w-[36px] h-[36px] rounded-full bg-slate-700'></span>
              <span className='text-sm'>@{currentUser.username}</span>
              <span className='flex-1 flex justify-end'>
                <TbDots className="h-[16px] w-[16px]" />
              </span>
            </button>
          </div>
        </div>
      </header>

      <main className='flex-grow flex-shrink flex justify-start overflow-y-auto'>
        <div className='w-[1050px]'>
          {children}
        </div>
      </main>
    </div>
  )
}

Layout.propTypes = {
  children: PropTypes.node,
}

export default Layout

import React, { useEffect, useCallback, useRef } from 'react'
import { baseStore } from '@/data/store'
import { useNavigate } from 'react-router-dom'
import Layout from '@/layout'
import { fetchAuth } from '@/utils/common'
import moment from 'moment'

const FeedPage = () => {
  const navigate = useNavigate()

  const userData = baseStore.useStore((state) => state.user)
  const posts = baseStore.useStore((state) => state.posts)

  if (!userData.username) {
    navigate('/login')
  }

  const fetchPosts = useCallback(async () => {
    fetchAuth(`${location.origin}/api/posts/pageable`, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((data) => {
        baseStore.setPosts(data)
      })
      .catch((err) => {
        console.error(err)
      })
  }, [])
  
  const firstLoad = useRef(true)
  if (firstLoad.current) {
    fetchPosts()
    firstLoad.current = false
  }
  
  useEffect(() => {
    const interval = setInterval(() => {
      fetchPosts()
    }, 5000)
    
    return () => clearInterval(interval)
  }, [posts]);
  
  return (
    <Layout>
      <button className='mb-8' onClick={() => navigate('/')}>Home</button>
      <hr className='mb-8' />

      <h1 className='text-3xl mb-4'>{userData.username}&apos;s feed</h1>
      {posts.map((post) => (
        <p key={post.id}><strong>({moment().format(post.createdAt)})</strong> {post.text}</p>
      ))}
      
    </Layout>
  )
}

export default FeedPage

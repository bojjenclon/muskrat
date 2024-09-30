import React, { useEffect, useCallback, useRef } from 'react'
import { baseStore } from '@/data/store'
import { useNavigate } from 'react-router-dom'
import Layout from '@/layout'
import { fetchAuth } from '@/utils/common'
import moment from 'moment'
import { Button, Card, Textarea } from 'flowbite-react'
import { TbTrash } from 'react-icons/tb'

const FeedPage = () => {
  const navigate = useNavigate()

  const userData = baseStore.useStore((state) => state.user)
  const posts = baseStore.useStore((state) => state.posts)
  const postContentRef = useRef()

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

  const onSubmit = () => {
    fetchAuth(`${location.origin}/api/posts/new`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: postContentRef.current.value
      })
    })
      .then((res) => res.json())
      .then((data) => {
        baseStore.setPosts(data)
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        postContentRef.current.value = ''
      })
  }

  const deletePost = (id) => {
    fetchAuth(`${location.origin}/api/posts/${id}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((data) => {
        baseStore.setPosts(data)
      })
      .catch((err) => {
        console.error(err)
      })
  }
  
  return (
    <Layout>
      <button className='mb-8' onClick={() => navigate('/')}>Home</button>
      <hr className='mb-8' />

      <h1 className='text-3xl mb-8'>{userData.username}&apos;s feed</h1>
      <div className='flex flex-col gap-2'>
        {posts.map((post) => (
          <Card key={post.id}>
            <div className='flex text-sm'>
              <strong className='flex-1'>({moment(post.createdAt).format("DD-MM-yy h:mm A")})</strong>
              <button onClick={() => deletePost(post.id)}><TbTrash className='w-4 h-4' color='red' /></button>
            </div>
            <p>{post.text}</p>
          </Card>
        ))}
      </div>
      
      <div className='mt-2 flex flex-col gap-2'>
        <Textarea id='post-content' placeholder={`What's on your mind?`} minLength={1} maxLength={255} rows={6} ref={postContentRef} />
        <div className='w-full flex justify-end'>
          <Button color='success' size='md' className='w-28' onClick={onSubmit}>Submit</Button>
        </div>
      </div>
    </Layout>
  )
}

export default FeedPage

import React, { useEffect, useRef, useState } from 'react'
import { baseStore } from '@/data/store'
import { useNavigate, useParams } from 'react-router-dom'
import Layout from '@/layout'
import { fetchAuth } from '@/utils/common'
import moment from 'moment'
import { Button, Card, Textarea } from 'flowbite-react'
import { TbTrash } from 'react-icons/tb'

const fetchUser = async (id) => {
  if (id === undefined) {
    return Promise.resolve(undefined)
  }

  const res = await fetchAuth(`${location.origin}/api/users/${id}`, {
    method: 'GET',
  })

  if (res.ok) {
    return await res.json()
  }

  return Promise.resolve(undefined)
}

const fetchPosts = async (id) => {
  if (id === undefined) {
    return Promise.resolve([])
  }
  
  const res = await fetchAuth(`${location.origin}/api/posts/${id}/pageable`, {
    method: 'GET',
  })

  if (res.ok) {
    return await res.json()
  }
  
  return Promise.resolve([])
}

const FeedPage = () => {
  const { feedId } = useParams()
  const navigate = useNavigate()
  
  const currentUser = baseStore.useStore((state) => state.user)
  const [userId, setUserId] = useState((typeof feedId === 'number') ? parseInt(feedId, 10) : currentUser.id)
  const isCurrentUser = userId === currentUser.id

  useEffect(() => {
    if (feedId === undefined) {
      setUserId(currentUser.id)
    }
  }, [feedId, currentUser])
  
  const [user, setUser] = useState({})
  const [posts, setPosts] = useState([])
  const postContentRef = useRef()
  
  const firstLoad = useRef(true)
  if (firstLoad.current) {
    fetchPosts(userId)
      .then((data) => {
        if (data) {
          setPosts(data)
        }
      })
      .catch((err) => {
        console.error(err)
      })
    
    firstLoad.current = false
  }

  useEffect(() => {
    fetchUser(userId)
      .then((data) => {
        if (data) {
          setUser(data)
        }
      })
      .catch((err) => {
        console.error(err)
      })
  }, [userId])
  
  useEffect(() => {
    const interval = setInterval(() => {
      fetchPosts(userId)
        .then((data) => {
          if (data) {
            setPosts(data)
          }
        })
        .catch((err) => {
          console.error(err)
        })
    }, 5000)
    
    return () => clearInterval(interval)
  }, [userId, posts]);

  const onSubmit = async () => {
    const res = await fetchAuth(`${location.origin}/api/posts/${userId}/new`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: postContentRef.current.value
      })
    })

    if (res.ok) {
      const data = await res.json()
      setPosts(data)
    }

    postContentRef.current.value = ''
  }

  const deletePost = async (id) => {
    const res = await fetchAuth(`${location.origin}/api/posts/${userId}/${id}`, {
      method: 'DELETE',
    })
    
    if (res.ok) {
      const data = await res.json()
      setPosts(data)
    }
  }
  
  return (
    <Layout>
      <div className='w-full flex border border-zinc-700 border-t-0 border-b-0'>
        <button className='w-1/2 h-[48px] hover:bg-zinc-900 hover:cursor-pointer'>
          <span className='text-slate-500'>For you</span>
        </button>
        <button className='w-1/2 h-[48px] hover:bg-zinc-900 hover:cursor-pointer'>
          <span className='h-full inline-flex flex-col flex-between'>
            <div className='flex-1 flex items-center'>
              <span className='font-bold'>Following</span>
            </div>
            <div className='w-auto h-[4px] bg-cyan-600 rounded-full'></div>
          </span>
        </button>
      </div>
    
      <div className='flex flex-col gap-2 border border-zinc-700 border-b-0 p-[8px]'>
        <Textarea className='bg-transparent resize-none !border-0 !border-transparent' id='post-content' placeholder={`What's on your mind?`} minLength={1} maxLength={255} rows={6} ref={postContentRef} />
        <div className='w-full flex justify-end'>
          <button className='px-[20px] py-[6px] bg-cyan-600 rounded-full font-bold' onClick={onSubmit}>Post</button>
        </div>
      </div>

      <div className='flex flex-col'>
        {posts.map((post, idx) => (
          <Card
            key={post.id}
            className={
              `bg-slate-black border-zinc-700 rounded-none`
                .concat(idx < posts.length - 1 ? ' border-b-0' : '')
            }
          >
            <div className='flex text-sm'>
              <strong className='flex-1'>({moment(post.createdAt).format("DD-MM-yy h:mm A")})</strong>
              <div className='flex-0'>
                {isCurrentUser && (
                  <button onClick={() => deletePost(post.id)}><TbTrash className='w-4 h-4' color='red' /></button>
                )}
              </div>
            </div>
            <p>{post.text}</p>
          </Card>
        ))}
      </div>
    </Layout>
  )
}

export default FeedPage

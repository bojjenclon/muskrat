import React, { useEffect, useRef, useState } from 'react'
import { baseStore } from '@/data/store'
import { useParams } from 'react-router-dom'
import { Button, Textarea } from '@headlessui/react'
import Layout from '@/layout'
import { fetchAuth } from '@/utils/common'
import moment from 'moment'
import { TbTrash } from 'react-icons/tb'

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
  
  const currentUser = baseStore.useStore((state) => state.user)
  const [userId, setUserId] = useState((typeof feedId === 'string') ? parseInt(feedId, 10) : currentUser.id)
  const [viewedUser, setViewedUser] = useState(null)
  const isCurrentUser = userId === currentUser.id
  const [canPost, setCanPost] = useState(true)

  useEffect(() => {
    if (feedId === undefined) {
      setUserId(currentUser.id)
    }
  }, [feedId, currentUser])
  
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
    const fetchUser = async () => {
      const res = await fetchAuth(`${location.origin}/api/users/${userId}`, {
        method: 'GET'
      })

      if (res.ok) {
        const data = await res.json()
        setViewedUser(data)
      } else {
        setViewedUser(null)
      }
    }
    
    fetchUser()
      .catch((err) => {
        console.error(err)
        setViewedUser(null)
      })
  }, [isCurrentUser])
  
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
      {isCurrentUser && (
        <>
          <div className='w-full flex border border-zinc-700 border-t-0 border-b-0'>
            <Button className='w-1/2 h-[48px] hover:bg-zinc-900 hover:cursor-pointer'>
              <span className='text-slate-500'>For you</span>
            </Button>
            <Button className='w-1/2 h-[48px] hover:bg-zinc-900 hover:cursor-pointer'>
              <span className='h-full inline-flex flex-col flex-between'>
                <div className='flex-1 flex items-center'>
                  <span className='font-bold'>Following</span>
                </div>
                <div className='w-auto h-[4px] bg-sky-500 opacity-90 rounded-full'></div>
              </span>
            </Button>
          </div>
        
          <div className='flex flex-col gap-2 border border-zinc-700 border-b-0 p-[10px]'>
            <Textarea
              className='p-[12px] bg-transparent text-lg resize-none border-0 border-transparent data-[focus]:outline-none'
              id='post-content'
              placeholder={`What's on your mind?`}
              minLength={1}
              maxLength={255}
              rows={6}
              ref={postContentRef}
              onChange={(evt) => setCanPost(evt.target.value.length > 0)}
            />

            <div className='w-full flex justify-end'>
              <Button
                className='px-[20px] py-[6px] bg-sky-500 rounded-full font-bold data-[disabled]:bg-sky-800 data-[disabled]:text-slate-300'
                disabled={!canPost}
                onClick={onSubmit}
              >
                Post
              </Button>
            </div>
          </div>
        </>
      )}

      {(!isCurrentUser && viewedUser) && (
        <div className='p-4 border border-zinc-700 border-t-0 border-b-0'>
          <h1 className='text-xl'>Viewing <strong>{viewedUser.username}</strong>&apos;s feed</h1>
        </div>
      )}

      <div className='flex flex-col'>
        {posts.map((post, idx) => (
          <div
            key={post.id}
            className={
              `flex flex-col gap-[6px] p-6 bg-slate-black border border-zinc-700 rounded-none`
                .concat(idx < posts.length - 1 ? ' border-b-0' : '')
            }
          >
            <div className='flex text-sm'>
              <strong className='flex-1'>({moment(post.createdAt).format("DD-MM-yy h:mm A")})</strong>
              <div className='flex-0'>
                {isCurrentUser && (
                  <Button onClick={() => deletePost(post.id)}><TbTrash className='w-4 h-4' color='red' /></Button>
                )}
              </div>
            </div>
            <p>{post.text}</p>
          </div>
        ))}
    
        {posts.length === 0 && (
          <div className='w-full h-full flex justify-center items-center p-8 border border-zinc-700'>
            <p>No posts yet</p>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default FeedPage

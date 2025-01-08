import { getCurrentUserAction } from '@/actions/auth.actions'
import { getAllPostsAction } from '@/actions/post.actions'
import React from 'react'
import Post from './Post'

const Posts = async () => {
    const currentUser = (await getCurrentUserAction()).data
    const posts = (await getAllPostsAction()).data
    
  return (
    <div className='flex flex-col gap-3 mt-4 max-h-[600px] overflow-auto'>
        {posts?.map((post , index)=>(
            <Post post={post} currentUser={currentUser} key={index + 1} />
        ))}
    </div>
  )
}

export default Posts
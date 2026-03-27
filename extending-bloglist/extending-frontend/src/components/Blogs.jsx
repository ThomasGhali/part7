import { useSelector, useDispatch } from 'react-redux'
import BlogItem from './BlogItem'
import BlogForm from './BlogForm'
import Togglable from './Togglable'
import { createBlog, fetchBlogs } from '../slices/blogsSlice'
import { showNotification } from '../slices/notificationsSlice'
import { useRef, useEffect } from 'react'

const Blogs = () => {
  const dispatch = useDispatch()

  // redux states
  const blogs = useSelector(state => state.blogs)

  // fetch blogs
  useEffect(() => {
    dispatch(fetchBlogs())
  }, [dispatch])

  const blogFormRef = useRef()

  const blogListRender = () => {
    if (!blogs || blogs.length === 0) return <>loading ...</>

    const sortBlogs = [...blogs].sort(
      (blogA, blogB) => blogB.likes - blogA.likes
    )

    return (
      <>
        {sortBlogs.map(blog => (
          <BlogItem key={blog.id} blog={blog} />
        ))}
      </>
    )
  }

  const handleCreateBlog = async newBlog => {
    try {
      await dispatch(createBlog(newBlog))
      blogFormRef.current.toggleVisibility()
    } catch (error) {
      const errorMsg =
        error.response?.status === 500
          ? 'Cannot connect to server'
          : 'unable to create new blog'
      dispatch(showNotification(errorMsg))
    }
  }

  return (
    <>
      <Togglable buttonLabel="Create new blog" ref={blogFormRef}>
        <BlogForm createBlog={handleCreateBlog} />
      </Togglable>
      {blogListRender()}
    </>
  )
}

export default Blogs

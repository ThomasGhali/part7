import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, setBlogs, addLike, showNotification, loggedUser }) => {
  const [visibility, setVisibility] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingBottom: 5,
    paddingLeft: 5,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }
  const InfoDisplay = { display: visibility ? '' : 'none' }

  const handleRemove = async () => {
    if (!window.confirm(`Remove ${blog.title} by ${blog.author}?`)) return

    try {
      await blogService.deleteBlog(blog.id)
      setBlogs((prev) => prev.filter((b) => b.id !== blog.id))
      showNotification('Blog deleted', true)
    } catch (error) {
      const errorMsg =
        error.status === 401
          ? 'User unauthorized to do such action'
          : error.message
      showNotification(errorMsg)
    }
  }

  return (
    <>
      <div style={blogStyle} className="blog">
        <div className="blog__info">
          {blog.title} {blog.author}
          <button
            className="view-btn"
            onClick={() => setVisibility((prev) => !prev)}
          >
            {visibility ? 'hide' : 'view'}
          </button>
        </div>
        <div style={InfoDisplay} className="blog__extra-info">
          <div>{blog.url}</div>
          <div>
            <span className="likes-count">Likes: {blog.likes}</span>{' '}
            <button onClick={() => addLike(blog)} className="like-btn">
              like
            </button>
          </div>
          <div>{blog.user.name}</div>
          {loggedUser === blog.user.name && (
            <button onClick={handleRemove}>Remove</button>
          )}
        </div>
      </div>
    </>
  )
}
export default Blog

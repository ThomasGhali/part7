import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addLike, deleteBlog } from '../slices/blogsSlice'

const Blog = ({ blog }) => {
  const [visibility, setVisibility] = useState(false)
  const dispatch = useDispatch()

  const loggedUser = useSelector(state => state.loggedUser).name

  const blogStyle = {
    paddingTop: 10,
    paddingBottom: 5,
    paddingLeft: 5,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }
  const InfoDisplay = { display: visibility ? '' : 'none' }

  return (
    <>
      <div style={blogStyle} className="blog">
        <div className="blog__info">
          {blog.title} {blog.author}
          <button
            className="view-btn"
            onClick={() => setVisibility(prev => !prev)}
          >
            {visibility ? 'hide' : 'view'}
          </button>
        </div>
        <div style={InfoDisplay} className="blog__extra-info">
          <div>{blog.url}</div>
          <div>
            <span className="likes-count">Likes: {blog.likes}</span>{' '}
            <button
              onClick={() => dispatch(addLike(blog))}
              className="like-btn"
            >
              like
            </button>
          </div>
          <div>{blog.user.name}</div>
          {loggedUser === blog.user.name && (
            <button onClick={() => dispatch(deleteBlog(blog))}>Remove</button>
          )}
        </div>
      </div>
    </>
  )
}
export default Blog

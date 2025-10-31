import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState({ title: '', url: '', author: '' })

  const handleCreateBlog = (event) => {
    event.preventDefault()
    createBlog(newBlog)
    setNewBlog({ title: '', url: '', author: '' })
  }

  const handleNewBlogInputs = (event) => {
    const { value, name } = event.target
    setNewBlog(prev => ({ ...prev, [name]: value }))
  }

  return (
    <>
      <h2>Create New</h2>
      <form onSubmit={handleCreateBlog}>
        <div>
          <label>Title:
            <input
              type="text"
              name='title'
              onChange={handleNewBlogInputs}
              value={newBlog.title}
            />
          </label>
        </div>
        <div>
          <label>Author:
            <input
              type="text"
              name='author'
              onChange={handleNewBlogInputs}
              value={newBlog.author}
            />
          </label>
        </div>
        <div>
          <label>URL:
            <input
              type="text"
              name='url'
              onChange={handleNewBlogInputs}
              value={newBlog.url}
            />
          </label>
        </div>
        <button>Create</button>
      </form>
    </>
  )
}

export default BlogForm
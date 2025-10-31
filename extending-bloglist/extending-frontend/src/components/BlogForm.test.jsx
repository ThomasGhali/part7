import { render, screen } from '@testing-library/react'
import { test, vi, describe, expect } from 'vitest'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

describe('<BlogForm />', () => {
  const demoBlog = {
    title: 'demo title',
    author: 'demo author',
    url: 'demo url',
    likes: 5,
    user: { name: 'demo name' }
  }

  test('passes right input values to the props function', async () => {
    const createBlog = vi.fn()
    render(<BlogForm createBlog={createBlog}/>)

    const user = userEvent.setup()

    const inputTitle = screen.getByLabelText(/title:/i)
    const inputAuthor = screen.getByLabelText(/author:/i)
    const inputURL = screen.getByLabelText(/url:/i)

    const createBtn = screen.getByRole('button', { name: /create/i })

    // fill form
    await user.type(inputTitle, demoBlog.title)
    await user.type(inputAuthor, demoBlog.author)
    await user.type(inputURL, demoBlog.url)

    // submit form
    await user.click(createBtn)

    // arguments passed to mock prop createBlog
    const [[passedArgs]] = createBlog.mock.calls

    expect(passedArgs.title).toBe(demoBlog.title)
    expect(passedArgs.author).toBe(demoBlog.author)
    expect(passedArgs.url).toBe(demoBlog.url)
  })
})
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

describe('<Blog />', () => {
  let container
  let addLike

  beforeEach(() => {
    const demoBlog = {
      title: 'demo title',
      author: 'demo author',
      url: 'demo url',
      likes: 5,
      user: { name: 'demo name' }
    }

    addLike = vi.fn()

    container = render(<Blog blog={demoBlog} addLike={addLike} />).container
  })

  test('displays only blog\'s title and author by default', () => {
    const blogTitle = screen.getByText(/demo title/i)
    const blogAuthor = screen.getByText(/demo author/i)
    const blogDetails = container.querySelector('.blog__extra-info')

    expect(blogTitle).toBeVisible()
    expect(blogAuthor).toBeVisible()

    expect(blogDetails).not.toBeVisible()
  })

  test('displays url and author when button is clicked', async () => {
    const user = userEvent.setup()

    const viewBtn = screen.getByRole('button', { name: /view/i })
    await user.click(viewBtn)

    const blogLikes = screen.getByText(/Likes: 5/i)
    const blogUrl = screen.getByText(/demo url/i)

    expect(blogLikes).toBeVisible()
    expect(blogUrl).toBeVisible()
  })

  test('calls event handler twice if like button clicked twice', async () => {
    const user = userEvent.setup()

    const viewBtn = screen.getByRole('button', { name: /view/i })
    await user.click(viewBtn)

    const likeBtn = screen.getByRole('button', { name: /like/i })
    await user.click(likeBtn)
    await user.click(likeBtn)

    expect(addLike.mock.calls).toHaveLength(2)
  })
})
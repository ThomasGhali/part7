const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  const sumOfBlogLikes = (sum, blog) => sum + blog.likes

  return blogs.length === 0
    ? 0
    : blogs.reduce(sumOfBlogLikes, 0)
}

const favouriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  const pickMostLiked = (mostLiked, blog) => {
    return blog.likes > mostLiked.likes
      ? blog
      : mostLiked
  }

  return blogs.reduce(pickMostLiked, blogs[0])
}

// categorize blogs according to auther and his blogs number
const categorizeBlogsNum = (blogs) => {
  return blogs.reduce((accum, curr) => {
    const hasAuthor = accum.find(blog => blog.author === curr.author)

    if (hasAuthor) {
      hasAuthor.blogs += 1
    } else {
      accum.push({ author: curr.author, blogs: 1 })
    }

    return accum
  }, [])
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const categorized = categorizeBlogsNum(blogs)

  return categorized.reduce((accum, curr) => {
    return curr.blogs > accum.blogs
      ? curr
      : accum

  }, categorized[0])
}

const categorizeBlogsLikes = (blogs) => {
  return blogs.reduce((accum, curr) => {
    const hasAuthor = accum.find(blog => blog.author === curr.author)

    if (hasAuthor) {
      hasAuthor.likes += curr.likes
    } else {
      accum.push({ author: curr.author, likes: curr.likes })
    }

    return accum
  }, [])
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const categorized = categorizeBlogsLikes(blogs)

  return categorized.reduce((accum, curr) => {
    return curr.likes > accum.likes
      ? curr
      : accum

  }, categorized[0])

}

module.exports = { dummy, totalLikes, favouriteBlog, mostBlogs, mostLikes }
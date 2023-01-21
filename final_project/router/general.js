const express = require('express')
let books = require('./booksdb.js')
let isValid = require('./auth_users.js').isValid
let users = require('./auth_users.js').users
const public_users = express.Router()

public_users.post('/register', (req, res) => {
  const username = req.body.username
  const password = req.body.password
  if (username && password) {
    if (!isValid(username)) {
      users.push({ username: username, password: password })
      return res
        .status(200)
        .json({ message: 'User successfully registred. Now you can login' })
    } else {
      return res.status(404).json({ message: 'User already exists!' })
    }
  }
  return res.status(404).json({ message: 'Unable to register user.' })
})

// Get the book list available in the shop
// public_users.get('/', function (req, res) {
//   res.send(JSON.stringify(books, null, 4))
// })
const getAllBooks = async () => {
  try {
    const allBooksPromise = await Promise.resolve(books)
    if (allBooksPromise) {
      return allBooksPromise
    } else {
      return Promise.reject(new Error('Books not found'))
    }
  } catch (err) {
    console.log(err)
  }
}

public_users.get('/', async function (req, res) {
  const data = await getAllBooks()
  res.json(data)
})

// **********************************
// * Get book details based on ISBN *
// **********************************
// public_users.get('/isbn/:isbn', function (req, res) {
//   const isbn = req.params.isbn
//   res.send(books[isbn])
// })

const getBookByISBN = async (isbn) => {
  try {
    const ISBNPromise = await Promise.resolve(isbn)
    return ISBNPromise
  } catch (err) {
    return Promise.reject(console.log(err))
  }
}

public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn
  const data = await getBookByISBN(isbn)
  res.send(books[data])
})

// Get book details based on author
// public_users.get('/author/:author', function (req, res) {
//   const author = req.params.author
//   const newBooksArray = []
//   Object.values(books).map((book) => {
//     if (book.author === author) {
//       newBooksArray.push(book)
//     }
//   })
//   res.send(newBooksArray)
// })

const findAuthor = async (author) => {
  try {
    if (author) {
      const newBooksArray = []
      Object.values(books).map((book) => {
        if (book.author === author) {
          newBooksArray.push(book)
        }
      })
      return Promise.resolve(newBooksArray)
    } else {
      return Promise.reject(new Error('Could not retrieve author'))
    }
  } catch (err) {
    return Promise.reject(console.log(err))
  }
}

public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author
  const data = await findAuthor(author)

  res.send(data)
})

// Get all books based on title
// public_users.get('/title/:title', function (req, res) {
//   const title = req.params.title
//   const newBooksArray = []
//   Object.values(books).map((book) => {
//     if (book.title === title) {
//       newBooksArray.push(book)
//     }
//   })
//   res.send(newBooksArray)
// })

const findTifle = async (title) => {
  try {
    const newBooksArray = []
    if (title) {
      Object.values(books).map((book) => {
        if (book.title === title) {
          newBooksArray.push(book)
        }
      })
      return Promise.resolve(newBooksArray)
    } else {
      return Promise.reject(new Error('Could not retrive book'))
    }
  } catch (err) {
    return Promise.reject(console.log(err))
  }
}

public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title
  const data = await findTifle(title)

  res.send(data)
})

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn
  Object.entries(books).map((book) => {
    if (book[0] === isbn) {
      res.send(book[1].reviews)
    }
  })
})

module.exports.general = public_users

const express = require('express')
const jwt = require('jsonwebtoken')
let books = require('./booksdb.js')
const regd_users = express.Router()
const session = require('express-session')

let users = [{ username: 'user123', password: 'password123' }]

const isValid = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username
  })
  if (userswithsamename.length > 0) {
    return true
  } else {
    return false
  }
}

regd_users.use(
  '/customer',
  session({
    secret: 'fingerprint_customer',
    resave: true,
    saveUninitialized: true,
  })
)

// **************************************************

const authenticatedUser = (username, password) => {
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password
  })
  if (validusers.length > 0) {
    return true
  } else {
    return false
  }
}

//only registered users can login
regd_users.post('/login', (req, res) => {
  const username = req.body.username
  const password = req.body.password

  if (!username || !password) {
    return res.status(404).json({ message: 'Error logging in' })
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      'access',
      { expiresIn: 60 * 60 }
    )

    req.session.authorization = {
      accessToken,
      username,
    }
    return res.status(200).send('User successfully logged in')
  } else {
    return res
      .status(208)
      .json({ message: 'Invalid Login. Check username and password' })
  }
})

// Add a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
  const isbn = req.params.isbn
  const review = req.body.review
  const username = req.session.authorization.username
  if (books[isbn]) {
    let book = books[isbn]
    book.reviews[username] = review
    return res.status(200).send(['Review successfully add', book])
    // return res.send(book)
  } else {
    return res.status(404).json({ message: `ISBN ${isbn} not found` })
  }
})

regd_users.delete('/auth/review/:isbn', (req, res) => {
  const isbn = req.params.isbn
  const username = req.session.authorization.username
  if (books[isbn]) {
    let book = books[isbn]
    delete book.reviews[username]
    return res.status(200).send(['Review successfully deleted', book])
    // return res.send(book)
  } else {
    return res
      .status(404)
      .json({ message: `Review with ISBN ${isbn} not found` })
  }
})

module.exports.authenticated = regd_users
module.exports.isValid = isValid
module.exports.users = users

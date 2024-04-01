const express = require('express');
let books = require("./booksdb.js");
let { users, authenticatedUser } = require("./auth_users.js");
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username, password = req.body.password;
  if (!username || !password) {
    return res.status(400).json({message: `Missing ${username ? "username" : "password"} in body!`});
  }
  if (authenticatedUser(username, password)) {
    return res.status(300).json({message: "User already exists!"});
  }
  users.push({ username, password })
  return res.status(200).json({ message: "User has been added" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  new Promise((resolve, reject) => {
    if (books) {
      resolve(books);
    } else {
      reject("No books found");
    }
  }).then(books => {
    res.status(200).json(books);
  }).catch(err => {
    res.status(500).json({message: err});
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  new Promise((resolve, reject) => {
    const book = books.find(book => book.isbn === parseInt(req.params.isbn));
    if (book) {
      resolve(book);
    } else {
      reject("Book not found");
    }
  }).then(book => {
    res.status(200).json(book);
  }).catch(err => {
    res.status(404).json({message: err});
  });
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  new Promise((resolve, reject) => {
    const bookObjs = books.filter(book => book.author == req.params.author);
    if (bookObjs.length > 0) {
      resolve(bookObjs);
    } else {
      reject("Books not found");
    }
  }).then(bookObjs => {
    res.status(200).json(bookObjs);
  }).catch(err => {
    res.status(404).json({message: err});
  });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  new Promise((resolve, reject) => {
    const bookObjs = books.filter(book => book.title.includes(req.params.title));
    if (bookObjs.length > 0) {
      resolve(bookObjs);
    } else {
      reject("Books not found");
    }
  }).then(bookObjs => {
    res.status(200).json(bookObjs);
  }).catch(err => {
    res.status(404).json({message: err});
  });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  new Promise((resolve, reject) => {
    const book = books.find(book => book.isbn === parseInt(req.params.isbn));
    if (book) {
      resolve(book.reviews);
    } else {
      reject("Book not found");
    }
  }).then(reviews => {
    res.status(200).json(reviews);
  }).catch(err => {
    res.status(404).json({message: err});
  });
});

module.exports.general = public_users;

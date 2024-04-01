const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const jwtConfig = require('../jwt.json')

let users = [];

const isValid = (token) => { //returns boolean
  try {
    return jwt.verify(token, jwtConfig.secret)
  } catch (e) {
    return false
  }
}

const authenticatedUser = (username, password) => { //returns boolean
  const userEntry = users.find(user => user.username == username);
  if (userEntry && userEntry.password == password) {
    return true;
  }
  return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username, password = req.body.password;
  if (!authenticatedUser(username, password)) return res.status(404).json({message: "User not found!"});
  const token = jwt.sign({ username }, jwtConfig.secret, jwtConfig.options);
  const userObj = users.find(user => user.username == username);
  userObj.session = token 
  return res.status(200).json({ token })
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const username = req.username;
  const bookReviews = books.find(book => book.isbn == req.params.isbn)?.reviews
  if (!bookReviews) {
    return res.status(400).json({message: "No book exists"});
  }
  if (req.query.review) {
    bookReviews[username] = req.query.review
    return res.status(200).json({message: "Review set"});
  } else {
    return res.status(400).json({message: "No review exists on request"});
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const username = req.username;
  const bookReviews = books.find(book => book.isbn == req.params.isbn)?.reviews;
  delete bookReviews[username];
  return res.status(200).json({message: "Review Deleted"});
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.authenticatedUser = authenticatedUser;
module.exports.users = users;

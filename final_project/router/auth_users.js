const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

var JWT_SECRET = "secretstring";
let users = [];

const isValid = (username)=>{
    if (!username) {
        return false;
    }      
    if (/[^a-zA-Z0-9_-]/.test(username)) {return false;}
    if (username.length < 3 || username.length > 20) {return false;}
    return true;
}

const authenticatedUser = (username,password)=>{
    const user = users[username];
    if (!user) {return false;}
    if (user.password === password) {return true;}
    return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });}
    
    const authenticated = authenticatedUser(username, password);
    
    if (!authenticated) {
        return res.status(401).json({ message: "Invalid username or password" });}
    
    // generate JWT token and store in session
    
    const token = jwt.sign({ username }, JWT_SECRET, {expiresIn: 60*60});
    
    req.session.authorization = {token:token};
    
    res.status(200).json({ message: "Login successful", token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const review = req.body.review; 
    const isbn = req.params.isbn;
    const username = req.session.username;
  
    // check if the book ID exists in the user's reviews
    if (books[isbn]) {
      books[isbn].reviews = { username: username, reviews: review };
      res.status(200).send("Review added successfully");
    } else {
      res.status(200).send("Book does not exist");
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.username;
  
    // check if the book exists and has any reviews
    if (books[isbn] && books[isbn].reviews) {
      // filter out the reviews for the given book ID and username
      delete books[isbn].reviews;
  
      res.status(200).send("Review deleted successfully");
    } else {
      res.status(404).send("Review not found");
    }
  });
    

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

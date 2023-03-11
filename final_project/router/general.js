const express = require('express');
let books = require("./booksdb.js");
const axios = require('axios');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send({ message: 'Username and password are required.' });}
    if (users[username]) {
        return res.status(409).send({ message: 'Username already exists.' });}
    users[username] = { username, password };
    return res.status(201).send({ message: 'User registration successful.' });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
//   try{
//     return res.send(JSON.stringify(books))
//   }catch(err){
//     return res.status(300).json({message: "Caught an error"});
//   }
    const promise = new Promise((resolve, reject) => {
        resolve(books);
    });
    promise.then((data) => {
        return res.send(JSON.stringify(data));
    })
    .catch((err) => {
        return res.status(300).json({message: "Caught an error"});
    });
});

// Get book details based on ID
public_users.get('/isbn/:isbn',function (req, res) {
    var isbn = req.params.isbn;
//   if (books[isbn]) {
//     return res.status(200).json(books[isbn]);}
//   else{
//     return res.status(404).json({message: "Book not found"});
//   }
    findBookByISBN(isbn)
    .then(function(book) {
        if (book) {return res.status(200).json(book);} 
        else {
            return res.status(404).json({message: "Book not found"});}
        })
        .catch(function(error) {
            return res.status(500).json({message: "Server error"});
        });
    function findBookByISBN(isbn) {
        return new Promise(function(resolve, reject) {
            if (books[isbn]) {resolve(books[isbn]);} 
            else {reject(null);}
        });
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    var author = req.params.author;
    // if (!book) {
    //   return res.status(404).json({message: "Book not found"});
    // }
    // return res.status(200).json(book);
    findBookByAuthor(author)
    .then(function(book) {
        if (book) {return res.status(200).json(book);} 
        else {
            return res.status(404).json({message: "Book not found"});}
        })
        .catch(function(error) {
            return res.status(500).json({message: "Server error"});
        });
    function findBookByAuthor(author) {
        return new Promise(function(resolve, reject) {
            const book = Object.values(books).find(b => b.author === author);
            if (book) {resolve(book);} 
            else {reject(null);}
        });
    }
  });

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    var title = req.params.title;
    // if (!book) {
    //   return res.status(404).json({message: "Book not found"});
    // }
    // return res.status(200).json(book);
    findBookByTitle(title)
    .then(function(book) {
        if (book) {return res.status(200).json(book);} 
        else {
            return res.status(404).json({message: "Book not found"});}
        })
        .catch(function(error) {
            return res.status(500).json({message: "Server error"});
        });
    function findBookByTitle(title) {
        return new Promise(function(resolve, reject) {
            const book = Object.values(books).find(b => b.title === title);
            if (book) {resolve(book);} 
            else {reject(null);}
        });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const bookID = req.params.isbn;
    const book = books[bookID];
    if (!book) {
        return res.status(404).send("Book not found");
    }
    const reviews = book.reviews;
    return res.send(reviews);
});

module.exports.general = public_users;

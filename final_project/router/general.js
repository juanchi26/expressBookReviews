const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const doesExist = (username) => {
    let userswithsamename = users.filter((user) => {
      return user.username === username
    });
    if (userswithsamename.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!doesExist(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registred. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });




});

function obtenerLibros() {
  return new Promise((resolve, reject) => {
    resolve(books)
  })
}

// Get the book list available in the shop
public_users.get('/', function (req, res) {

  obtenerLibros().then((libros) => res.send(JSON.stringify(libros, null, 4)))

});

// Get book details based on ISBN 
public_users.get('/isbn/:isbn', function (req, res) {

  obtenerLibros().then((libro) => {
    let book = req.params.isbn
    res.send(libro[book])
  })



});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {

  obtenerLibros().then((libros) => {
    let author = req.params.author
    let libro = ""
    for (let book in libros) {
      if (libros[book].author === author) {
        libro += JSON.stringify(libros[book])
      }
    }
    res.send(libro)

  })


});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {

  obtenerLibros().then((libros) => {
        let title = req.params.title

        for (let book in libros) {
          if (libros[book].title === title) {
            res.send(libros[book])
          }
        }
  })


});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  obtenerLibros().then((libros) => {
    let book = req.params.isbn
    res.send(libros[book].reviews)
  })
  
});

module.exports.general = public_users;

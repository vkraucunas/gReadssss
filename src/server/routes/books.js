var express = require('express');
var router = express.Router();
var pg = require('pg');
var queries = require('../../../db/queries');

router.get('/', function(req, res, next) {
    queries.Books()
    .then(function(bookResult) {
        var bookQuery = {};
        bookResult.map(function(book){
            book.authors = [];
            bookQuery[book.id] = book;
        });
        queries.AuthorsByBookId()
        .then(function(authorResult){
            authorResult.map(function(author){
                bookQuery[author.book_id].authors.push(author);
            });
            res.render('books', {
                title: 'All Books',
                books: bookQuery,
                total: bookResult.length
            })
        })
    })
});

router.get('/:id', function(req, res, next) {
  res.render('book_show', { title: 'Express' });
});

router.get('/new', function(req, res, next) {
  res.render('book_new_edit', { title: 'Express' });
});

router.get('/:id/edit', function(req, res, next) {
  res.render('book_new_edit', { title: 'Express' });
});

router.post('/new', function(req, res, next) {
  queries.addBook(req.body)
  .then(function() {
    res.redirect('/');
  })
  .catch(function(err) {
    console.log('Error:', err);
    return err;
  });
});

router.post('/:id/edit', function(req, res, next) {
  queries.editBook(req.body, req.params.id)
  .then(function() {
    res.redirect('/' + req.params.id);
  })
  .catch(function(err) {
    console.log('Error:', err);
    return err;
  });
});

router.post('/:id/delete', function(req, res, next) {
  queries.deleteBook(req.params.id)
  .then(function() {
    res.redirect('/');
  })
  .catch(function(err) {
    console.log('Error:', err);
    return err;
  });
});

module.exports = router;

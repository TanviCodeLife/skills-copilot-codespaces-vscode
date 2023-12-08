// Create web server application
var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
//var mongodb = require('mongodb');
//var MongoClient = mongodb.MongoClient;
//var url = 'mongodb://localhost:27017/comments';
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/comments');

// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Set views folder
app.set('views', path.join(__dirname, 'views'));

// Set view engine
app.set('view engine', 'ejs');

// Set route to index page
app.get('/', function (req, res) {
    res.render('index');
});

// Set route to comments page
app.get('/comments', function (req, res) {
    // Fetch comments from database
    var Comments = mongoose.model('Comments', { name: String, comment: String });
    Comments.find(function (err, comments) {
        if (err) return console.error(err);
        res.render('comments', { comments: comments });
    });
});

// Set route to add comment
app.post('/addComment', urlencodedParser, function (req, res) {
    // Fetch comment from request body
    var comment = req.body.comment;
    var name = req.body.name;
    // Add comment to database
    var Comments = mongoose.model('Comments', { name: String, comment: String });
    var comments = new Comments({ name: name, comment: comment });
    comments.save(function (err) {
        if (err) return console.error(err);
    });
    res.redirect('/comments');
});

// Set route to delete comment
app.get('/deleteComment/:id', function (req, res) {
    // Fetch comment id from request parameters
    var id = req.params.id;
    // Delete comment from database
    var Comments = mongoose.model('Comments', { name: String, comment: String });
    Comments.findByIdAndRemove(id, function (err) {
        if (err) return console.error(err);
    });
    res.redirect('/comments');
});

// Start web server
var server = app.listen(8080, function () {
    console.log('Node server is running..');
});
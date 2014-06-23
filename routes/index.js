var express = require('express');
var router = express.Router();
var app = require('../app');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});


/* GET Hello World page. */
router.get('/helloworld', function(req, res) {
    res.render('helloworld', { title: 'Hello, World!' })
});

/* GET Tweets page */
router.get('/tweetlist', function(req, res){
  var db = req.db;
  var collection = db.get('tweetcollection');
  collection.find({},{}, function(e,docs) {
    res.render('tweetlist', {
      "tweetlist": docs
    });
  });
});

// GET New tweet page
router.get('/newTweet', function(req, res){
  res.render('newTweet', {title: "Add new tweet"});
});

// POST to add tweet
router.post('/addTweet', function(req, res) {
  var db = req.db;

  var content = req.body.content;
  var user = req.body.user;

  var collection = db.get('tweetcollection');

  collection.insert({
    "user" : user,
    "content" : content
  }, function (err, doc) {
    if (err){
      res.send("Problem adding info");
    }
    else {
      res.location("tweetlist");
      res.redirect("tweetlist");

    }
  });
});


var get_matches = require('../matches');
var today_matches;


get_matches(function (matches) {
  today_matches = matches;

});

//  GET worldcup
router.get('/wc', function(req, res) {

  var db = req.db;



  res.render('worldcup', {title: "World Cup 2014", matches:today_matches});
});

module.exports = router;

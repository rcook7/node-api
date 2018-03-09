var express = require('express');
var router = express.Router();

var Post = require('../models/post.js');

var callback = function(res) {
  return function(err, post) {
    if (err)
      res.send(err);
    res.json(post);
  }
}

router.get('/', function(req, res, next) {
  Post.find(function(err, posts) {
    if (err)
      res.send(err);
    res.json(posts);
  });
});

router.post('/', function(req, res, next) {
  var new_post = new Post(req.body);
  new_post.save(callback(res));
});

router.get('/:postId', function(req, res, next) {
  Post.findById(req.params.postId, callback(res));
});

router.put('/:postId', function(req, res, next) {
  Post.findByIdAndUpdate(req.params.postId, req.body, {new: true}, callback(res));
});

router.delete('/:postId', function(req, res, next) {
  Post.findByIdAndRemove(req.params.postId, callback(res));
});

router.post('/search', function(req, res, next) {
  let search = req.body.search.trim();
  if (search) {
    var query = Post.find(
      { $text: { $search: req.body.search } },
      { score: { $meta: "textScore" } }
    ).sort( { score: { $meta: "textScore" } } );
    query.exec(callback(res));
  } else {
    Post.find({}, callback(res));
  }
});

module.exports = router;

var express = require('express');
var router = express.Router();

var Todo = require('../models/todo.js');

var callback = function(res) {
  return function(err, todos) {
    if (err) {
      res.send(err);
    }
    res.json(todos);
  }
}

router.get('/', function(req, res, next) {
  Todo.find(callback(res));
});

router.post('/', function(req, res, next) {
  var new_todo = new Todo(req.body);
  new_todo.save(callback(res));
});

router.get('/:todoId', function(req, res, next) {
  Todo.findById(req.params.todoId, callback(res));
});

router.put('/:todoId', function(req, res, next) {
  Todo.findByIdAndUpdate(req.params.todoId, req.body, {new: true}, callback(res));
});

router.post('/toggle/:todoId', function(req, res, next) {
  Todo.findById(req.params.todoId, (err, todo) => {
    todo.complete = !todo.complete;
    console.log(todo);
    todo.save(err => {
      console.log(err);
      if (err) {
        res.send(err);
      }
      res.json(todo);
    });
  });
});

router.delete('/:todoId', function(req, res, next) {
  Todo.findByIdAndRemove(req.params.todoId, callback(res));
});

router.get('/filter/:filter', function(req, res, next) {
  switch(req.params.filter) {
    case 'all':
      Todo.find(callback(res));
      break;
    case 'active':
      Todo.find({complete: false}, callback(res));
      break;
    case 'completed':
      Todo.find({complete: true}, callback(res));
      break;
    default:
      res.json([]);
      break;
  }
});

module.exports = router;

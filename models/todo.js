var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TodoSchema = new Schema({
  text: String,
  complete: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('todos', TodoSchema);

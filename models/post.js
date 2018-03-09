var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = new Schema({
  title: {
    type: String,
    index: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  body: String,
  tags: String,
});

PostSchema.index({'tags': 'text', 'body': 'text'});

module.exports = mongoose.model('Posts', PostSchema);

//require mongoose
var mongoose = require('mongoose');
//create Schema
var Schema = mongoose.Schema;

//create the article schema
var ArticleSchema = new Schema({
  //key with object values
  title: {
    type: String,
    require: true
  },
  link: {
    type: String,
    require: true
  },
  img: {
    type: String,
    require: false
  },
  player: {
    type: String,
    require: false
  },
  date: {
    type: String,
    require: true
  },
  saved: {
    type: Boolean,
    default: false
  }
  /*note: {
    type: Schema.Types.ObjectId,
    ref: 'Note'
  }*/
},{
  timestamps: {
    createdAt: 'created_at'
  }
});

//create the model
var Article = mongoose.model('Article', ArticleSchema);

//exports
module.exports = Article;

//require mongoose
var mongoose = require('mongoose');
//create schema class
var Schema = mongoose.Schema;

//create the note schema
var NoteSchema = new Schema({
    body: {
      type: String,
      require: false
    }
  },{
      timestamps: {
        createdAt: 'created_at'
      }
});

//create the note model
var Note = mongoose.model('Note', NoteSchema);

//exports
module.exports = Note;

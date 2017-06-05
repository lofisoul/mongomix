//require mongoose
var mongoose = require('mongoose');
//create schema class
var Schema = mongoose.Schema;

//create the note schema
var NoteSchema = new Schema({
    name: {
      type: String,
      required: true
    },
    body: {
      type: String
    }
});

//create the note model
var Note = mongoose.model('Note', NoteSchema);

//exports
module.exports = Note;

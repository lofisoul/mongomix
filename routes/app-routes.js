//express
var express = require('express');
//mongoose
var mongoose = require('mongoose');

//scrapers
var cheerio = require('cheerio');
var request = require('request');

//models
var Article = require('../models/Article.js');
var Note = require('../models/Note.js');

module.exports = function(app) {
  //scrape Last Gas Station
  app.get('/scrape', function(req,res){
    //use request to grab html body
    request('http://www.lagasta.com/', function(err, res, html){
      //throw an Error
      if(err) throw err;

      //load into cheerio
      //$ becomes shorthand selector ala jQuery
      var $ = cheerio.load(html);

      //grab post content
      $('.post').each(function(i, el){

        //save it into an empty obj
        var result = {};

        //grab components of post
        result.title = $(this).find('h2').text();
        result.link = $(this).find('h2 a').attr('href');
        result.img = $(this).find('img').attr('src');
        result.player = $(this).find('iframe').attr('src');
        result.date = $(this).find('h2+span').text().trim();
        result.date = result.date.substring(5);


        //pass into the article model and create a new entry for db
        var entry = new Article(result);

        //take the entry and save it (no duplicates)
        Article.findOneAndUpdate(
          {link: result.link}, //filter for the query
          entry, //document to insert when nothing is found
          {upsert: true, new: true},
          function(err, doc) { //callback
            if(err) {
              console.log(err);
            } else {
              console.log('Entry: ' + doc);
            }
          }
        );
      });
    });
    //done
    res.redirect('/');
  });

  //GET the articles from mongoDB
  //display them on landing page
  app.get('/', function(req, res){
    //grab doc from array
    Article.find({}).sort('-created_at').exec(function(err,doc){
      //log errors
      if(err) {
        console.log('Article find: ' + err);
      } else {
        res.render('listings', {Articles: doc});
      }
    });
  });

  //modify the post saved
  app.put('/:_id', function(req,res){
    Article.findOneAndUpdate(
      {_id: req.params._id}, //filter
      {saved: req.body.saved}, //condition to update
      function(err, doc) {
        if(err) {
          console.log('Update Error: ' + err);
        } else {
          res.redirect('/');
        }
      }
    );
  });

  //render the saved articles page
  app.get('/saved', function(req,res){
    Article.find({saved: true}).sort('updatedAt').exec(function(err,doc){
      if(err){
        console.log('Saved Error: '+ err)
      } else {
        console.log('hitting here!');
        res.render('saved', {Articles: doc});
      }
    });
  });

  //modify the post saved
  app.put('/saved/:_id', function(req,res){
    Article.findOneAndUpdate(
      {_id: req.params._id}, //filter
      {saved: req.body.saved}, //condition to update
      function(err, doc) {
        if(err) {
          console.log('Saved Update Error: ' + err);
        } else {
          res.redirect('/saved');
        }
      }
    );
  });

  //grab an article by it's ID and populate notes
  //this will be used in ajax app level request!
  app.get('/saved/:id', function(req,res){
    Article.findOne({_id: req.params.id}) //filter
      .populate('notes') //populating with all the notes
      .exec(function(err,doc){
        if(err){
          console.log(err);
        } else{
          //send a json doc to the browser
          res.json(doc);
        }
      });
  });

  //create a new note
  app.post('/saved/:id', function(req, res){
    //create a new note object and pass it the req. body
    var newNote = new Note(req.body);

    //save the new note to the db
    newNote.save(function(err,doc){
      if(err) {
        console.log(err);
      } else {
        console.log('doc before update:' + doc);
        console.log('PARAMS: ' + req.params.id);
        console.log('article ID before update:' + req.params.id);
        console.log('note before update:' + doc._id);
        //this is the issue!
        Article.findOneAndUpdate({_id: req.params.id}, {$push: {notes: doc._id}}, {new: true}, function(err,newdoc){
          if(err) {
            console.log(err);
          } else {
            console.log('Check you stocking!' + ' ' + newdoc);
            res.redirect('/saved');

          }
        });
      }
    });
  });

  //delete the note from the database
  app.post('/delete/:id', function(req,res) {
    Note.remove({_id: req.params.id}, function(err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log('document removed');
            res.redirect('/saved');
        }
    });
  });



} //here's the export!

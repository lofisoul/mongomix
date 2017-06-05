//requires!!
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

//models
var Article = require('./models/Article.js');
//var Note = require('./models/Note.js');

//scrapers
var request = require('request');
var cheerio = require('cheerio');

//set mongoose for ES6
mongoose.Promise = Promise;

//init express
var app = express();
var port = process.env.PORT || 3030

app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

// Override with POST having ?_method=DELETE
//app.use(methodOverride("_method"));

app.use(express.static("public"));

//handlebars
var exphbs = require('express-handlebars');

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

//configure db
mongoose.connect('mongodb://localhost/mongomix');
var db = mongoose.connection;
//show mongoose errs
db.on('error', function(err){
  console.log('Mongoose Error: ', err);
});
//confirm success
db.once('open', function(){
  console.log('Mongoose connected!');
});

//routes

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
  Article.find({}).sort('created_at').exec(function(err,doc){
    //log errors
    if(err) {
      console.log('Article find: ' + err);
    } else {
      res.render('listings', {Articles: doc});
    }
  });
});

//listen up!
app.listen(port, function(){
  console.log('Hello Smithers. You. Are. Good. At. Turning. Me. On: ' + port);
});

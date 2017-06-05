//requires!!
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

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
require('./routes/app-routes.js')(app);

//listen up!
app.listen(port, function(){
  console.log('Hello Smithers. You. Are. Good. At. Turning. Me. On: ' + port);
});
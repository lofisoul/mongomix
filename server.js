//requires!!
var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var logger = require('morgan');
var mongoose = require('mongoose');
//favicon
var favicon = require('serve-favicon');
var path = require('path');


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
app.use(methodOverride('_method'));

app.use(express.static('public'));

//handlebars
var exphbs = require('express-handlebars');

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

//favicon
app.use(favicon(path.join(__dirname,'public','favicon.ico')));

//configure db
//adding mongoose heroku deployment
if(process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI);
} else{
  mongoose.connect('mongodb://localhost/mongomix');
}

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

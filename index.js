// This assumes you know vanilla MongoDB set up
const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      assert = require('assert'),
      mustacheExpress = require('mustache-express'),
      mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      PORT = process.env.PORT || 3000;


// Mustache and Express set up in general
app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// Body Parser set up
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Opens a connection to the database
mongoose.connect('localhost:27017/test');

// Creates a schema for how mongoose should insert/validate data
// Schema accepts a javascript object as the first argument of the constructor
// This is only defining the LAYOUT
const userDataSchema = new Schema(
  // First argument is REQUIRED and is the object template
  {
    // Arguments are validated for types (remember that MongoDB is strictly typed)
    title: String,
    // Or can be validated for presence
    content: {type: String, required: true},
    author: String
  }
  // Second argument is optional and overrides any thing set in the model (below)
  ,{collection: 'user-data'});

// This defines the model that uses the above layout
// mongoose automitically pluralizes the model name (like in Rails)
const UserData = mongoose.model('UserData', userDataSchema);

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/get-data', (req, res, next) => {
  
});

app.post('/insert', (req, res, next) => {
  const item = {
    title: req.body.title,
    content: req.body.content,
    author: req.body.author
  };

  
});

app.post('/update', (req, res, next) => {
  const item = {
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
  };

  const id = req.body.id
  
});

app.post('/delete', (req, res, next) => {
  const id = req.body.id

})

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
})
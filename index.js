const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      mongo = require('mongodb'),
      assert = require('assert'),
      // Port 27017 is the default port
      // test is the databas that mongodb ships with
      url = 'mongodb://localhost:27017/test',
      mustacheExpress = require('mustache-express'),
      PORT = process.env.PORT || 3000;

// Mustache and Express set up in general
app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// Body Parser set up
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/get-data', (req, res, next) => {

});

app.post('/insert', (req, res, next) => {
  // Gets all the information from the request object which is parsed by bodyParser
  const item = {
    title: req.body.title,
    content: req.body.content,
    author: req.body.author
  };

  // connect accepts two arguments: the url where the database is and a callback function
  // the callback function accepts two arguments: error and the database
  mongo.connect(url, (err, db) => {

  })

  res.redirect('/');
});

app.post('/update', (req, res, next) => {

});

app.post('/update', (req, res, next) => {

});

app.post('/delete', (req, res, next) => {

})

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
})
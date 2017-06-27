const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      mongo = require('mongodb').MongoClient,
      objectID = require('mongodb').ObjectID,
      assert = require('assert'),
      // Port 27017 is the default port
      // test is the database that mongodb ships with
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
  let resultArray = [];
  mongo.connect(url, (err, db) => {
    assert.equal(null, err);

    // Cursor is basically a pointer that points to the location where all the data in the collection are stored
    const cursor = db.collection('user-data').find();

    cursor.forEach((document, err) => {
      assert.equal(null, err);
      resultArray.push(document);
    }, () => {
      // This block runs after the forEach has looped through
      // Important that we go here because it will only be executed after the forEach is done. Setting cursor is asynchronous
      db.close();
      console.log('resultsArray', resultArray);
      res.render('index', {items: resultArray});
    })
  })
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
    // Asserts that there is no error
    assert.equal(null, err);

    // Inside the database, there will be a connection to a *collection* called user-data (you specify this) and then we call the method insertOne on this to insert one
    // the insertOne function accepts two arguments: the insterted object and a callback function
    // The callback function accepts 2 arguments: err and result
    db.collection('user-data').insertOne(item, (err, result) => {
       assert.equal(null, err);

       console.log('Item inserted');
      //  console.log(result);

      //  Closes connection to the database
       db.close();
    })
  })

  res.redirect('/');
});

app.post('/update', (req, res, next) => {
  const item = {
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
  };

  // This has to be separate from the rest of the object because you're not rewriting the ID of the document
  const id = req.body.id

  mongo.connect(url, (err, db) => {
    assert.equal(null, err);

    // UpdateOne takes 3 arguments
    db.collection('user-data').updateOne(
      // First Arg: however you search for it
      // In this case we're using ID since we know that is guaranteed to specify one
      // The ID HAS to be an objectID. Extract this from the mongodb client
      {"_id": objectID(id)}, 
      
      // Specifies what the new data should be
      {$set: item},
      (err, result) => {
        assert.equal(null, err);
        console.log('item updated');
        db.close();

        res.redirect('/');
    })
  })
});

app.post('/delete', (req, res, next) => {
  const id = req.body.id

  mongo.connect(url, (err, db) => {
    assert.equal(null, err);

    // UpdateOne takes 2 arguments
    db.collection('user-data').deleteOne(
      // First argument is the identifier for document
      {"_id": objectID(id)}, 

      // Second argument is callback function
      (err, result) => {
        assert.equal(null, err);
        console.log('item deleted');
        db.close();

        res.redirect('/');
    })
  })
})

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
})
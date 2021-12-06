/*
CSc 337
Finnley Hartz
This is the server js file for the chatty project.
*/

const mongoose = require('mongoose');
const express = require('express');
const parser = require('body-parser')

const app = express();
app.use(parser.json() );
app.use(parser.urlencoded({ extended: true })); 

const db  = mongoose.connection;
const mongoDBURL = 'mongodb://127.0.0.1/chatty';

// SCHEMA

var Schema = mongoose.Schema;

var ListSchema = new Schema({
  alias: String,
  message: String
});

var List = mongoose.model('List', ListSchema);


app.use(express.static('public_html'));

// Set up default mongoose connection
mongoose.connect(mongoDBURL, { useNewUrlParser: true });
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
console.log('Connected to Database')

// send the list of messages from database to code.js  
app.get('/list', (req, res) => {
  List
    .find({})
    .exec( (err, results) => {
      if (err) { return res.end('ERROR'); }
      var resString = '';
      for (i in results) {
        r = results[i];
        resString += '<p><b style="font-weight: bold;">' + r.alias + ':</b> ' + r.message + '</p>\n'
      }
      res.end(resString);
    });
});

// receive message from code.js and save in list in database
app.post('/create/list/:alias/:message', (req, res) => {
  messageList = req.params.message.split('+');
  messageString = messageList.join(' ');
  var l1 = new List({alias: req.params.alias, message: messageString});
  l1.save( (err) => {
    if (err) res.end('PROBLEM');
    res.end('SAVED');
  })
});


const port = 5000;
app.listen(port, () => {
  console.log('server has started');
});

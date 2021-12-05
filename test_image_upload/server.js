const mongoose = require('mongoose');
const express = require('express');
const multer = require('multer');
const { extname } = require('path');
const parser = require('body-parser');
const cookieParser = require('cookie-parser');

const PORT = 5000;

const app = express();
//app.use( parser.text({type: '*/*'}) );
app.use(cookieParser());
app.use(parser.urlencoded({extended: true}));

app.use(express.static('public_html'));

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public_html/uploads/images')
    },
    filename: function (req, file, cb) {
        cb(null, ('' + Math.floor(Math.random() * 1000000000000000)) + extname(file.originalname) );
    }
})
const upload = multer({storage: storage});

app.post('/app/upload/', upload.single('image'), (req, res) => {
    if(req.file) {
        res.end(req.file.filename);
    }
    else throw 'error';
});

// Some code for tracking the sessions on the server
var sessions = {};
const LOGIN_TIME = 600000;

function filterSessions() {
  var now = Date.now();
  for (x in sessions) {
    username = x;
    time = sessions[x];

    if (time + LOGIN_TIME < now) {
      console.log('delete user session: ' + username);
      delete sessions[username];
    }
  }
}

setInterval(filterSessions, 2000);

function addSession(username) {
  var now = Date.now();
  sessions[username] = now;
}

function doesUserHaveSession(username) {
  return username in sessions;
}

const db  = mongoose.connection;
const mongoDBURL = 'mongodb://127.0.0.1/test_image_upload3';

// Schemas

var Schema = mongoose.Schema;

// Post
var ItemSchema = new Schema({ 
    caption: String,
    image: String,
    username: String,
    likes: Array,
    timestamp: {type: Date, default: Date.now},
    comments: Array 
});

var Item = mongoose.model('Item', ItemSchema);



// Comment
var CommentSchema = new Schema({ 
    username: String,              
    comment: String,
    post: String,
    comments: Array});
  
var Comment = mongoose.model('Comment', CommentSchema);




// User
var UserSchema = new Schema({ 
    username: String,
    password: String,
    profile: {type:String, default: 'blank-profile-picture-png.png'},
    posts: Array,                  
    followers: Array,
    following: Array,
    chats: Array
});
  
var User = mongoose.model('User', UserSchema);


app.use('/app/*', authenticate);
app.get('/', (req, res) => { res.redirect('/index.html'); });

mongoose.connect(mongoDBURL, { useNewUrlParser: true });
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
console.log('Connected to Database')

// function to authenticate the user
function authenticate(req, res, next) {
    var c = req.cookies;
    if (c && c.login)  {
      var username = c.login.username;
      if (doesUserHaveSession(username)) {
        console.log('authenticating success!')
        addSession(username);
        next();
      } else {
        res.redirect('/index.html');
      }
    } else {
      res.redirect('/index.html');
    }
}
  
function x(err) { 
    if (err) return res.end('FAIL'); 
    Users.findOne({username: u})
      .exec(function (err, result) {
        if (err) return res.end('FAIL'); 
        result.lists.push(l._id);
        result.save(function (err) { 
          if (err) return res.end('FAIL'); 
          else { res.end('SUCCESS!'); }
        });
    });
}

// handle get request; return all users
app.get('/get/users/', (req, res) => {
    User
      .find({})
      .exec( (err, results) => {
        if (err) { return res.end('ERROR'); }
        res.end(JSON.stringify(results));
      });
});
  
// handle get request; return all items
app.get('/get/items/', (req, res) => {
    Item
      .find({})
      .exec( (err, results) => {
        if (err) { return res.end('ERROR'); }
        res.end(JSON.stringify(results));
      });
});

app.get('/app/create/item/:image/:caption/', (req, res) => {
    var c = req.cookies;
    if (c && c.login)  {
      var u = c.login.username;
      var i = new Item({ 
        caption: req.params.caption, 
        image: req.params.image,
        username: u
      });
      i.save(function (err) { if (err) console.log('FAIL'); });
      res.send('SAVED');
      console.log(i)
      
    // add item id to user's listings
    User.findOneAndUpdate(
      { username: u },
      { $push: { posts: i._id } },
    ).exec();
    } else {
      res.end('FAIL');
    }
});




// handle get request; return own items
app.get('/get/items/', (req, res) => {
    var c = req.cookies;
    if (c && c.login)  {
      var u = c.login.username;
      console.log('getting posts for user ' + u);
      Item
        .find({username : u})
        .exec( (err, results) => {
          if (err) { return res.end('ERROR'); }
          res.end(JSON.stringify(results));
        });
    } else {
      res.end(JSON.stringify([]));
    }
});



// handle get request; return other items
app.get('/get/items/:u', (req, res) => {
    u = req.params.u
    var c = req.cookies;
    if (c && c.login)  {
      console.log('getting posts of user ' + u);
      Item
        .find({username : u})
        .exec( (err, results) => {
          if (err) { return res.end('ERROR'); }
          res.end(JSON.stringify(results));
        });
    } else {
      res.end(JSON.stringify([]));
    }
});



// create new user
app.get('/account/create/:username/:password', (req, res) => {
    console.log(req.params.username, req.params.password)
    User.find({username: req.params.username})
      .exec( function (err, results) {
        if (err) { 
          return res.end('failed to create');
        } else if (results.length == 0) {
          var u = new User({
             username: req.params.username,
             password: req.params.password
           });
           u.save(
             function (err) {
               if (err) { return res.end('Failed to create user!'); }
               else { res.end('Account created!'); }
             });
        } else {
          res.end('username already taken');
        }
      });
}); 

//login user; start user session
app.get('/account/login/:username/:password', (req, res) => {
    User.find({username: req.params.username, password: req.params.password})
      .exec( function (err, results) {
        if (err) { 
          return res.end('failed to login');
        } else if (results.length == 1) {
          addSession(req.params.username);
          res.cookie("login", {username: req.params.username}, {maxAge: 600000});
          res.end('LOGIN');
        } else {
          res.end('incorrect number of results');
        }
      });
});

// return all users whose username includes the keyword
app.get('/app/search/users/:keyword', (req, res) => {
    User
      .find({username : {$regex : req.params.keyword}})
      .exec( (err, results) => {
        if (err) { return res.end('ERROR'); }
        res.end(JSON.stringify(results));
      });
});



app.get('/app/get/profile/', (req, res) => {
    var c = req.cookies;
    if (c && c.login)  {
      var u = c.login.username;
      console.log('getting profile of user ' + u);
      User
        .find({username : u})
        .exec( (err, results) => {
          if (err) { return res.end('ERROR'); }
          res.end(JSON.stringify(results));
        });
    } else {
      res.end(JSON.stringify([]));
    }
});
  
app.listen(PORT, () => {
    console.log('Listening at ' + PORT );
});



app.get('/app/create/item/:postId/:comment/', (req, res) => {
    var c = req.cookies;
    if (c && c.login)  {
      var u = c.login.username;
      var i = new Comment({ 
        comment: req.params.comment, 
        post: req.params.postId,
        username: u
      });
      i.save(function (err) { if (err) console.log('FAIL'); });
      res.send('SAVED');
      console.log(i)
      
    // add item id to user's listings
    Item.findOneAndUpdate(
      { _id: postId },
      { $push: { comments: i._id } },
    ).exec(res.end(i._id));
    } else {
      res.end('FAIL');
    }
});

app.get('/app/like/item/:postId/', (req, res) => {
    var c = req.cookies;
    if (c && c.login)  {
      var u = c.login.username;
      
      // add item id to user's listings
      Item.findOneAndUpdate(
        { _id: postId },
        { $push: { likes: u } },
      ).exec(res.end());
    } else {
      res.end('FAIL');
    }
});
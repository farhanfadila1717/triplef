//// Import Node Modules
const express = require('express');
const session = require('express-session');
const expressLayaouts = require('express-ejs-layouts');
const MongoDBSession = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');

const app = express();
const appName = 'Share.doc';
const port = 5000;
const mongoURI = 'mongodb://localhost:27017/triplef';

mongoose.connect(mongoURI,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  }
).then(() => {
  console.log('MongoDB Connected');
});

const store = new MongoDBSession({
  uri: mongoURI,
  collection: 'session',
});

app.set('view engine', 'ejs');
app.use(expressLayaouts);
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
require('./routes/web.js')(app);
app.use(
  session({
    secret: 'key-triplef',
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.listen(port, () => {
  console.log(`Server started on port http://localhost:${port}`);
});
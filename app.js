const express = require('express');
const expressLayaouts = require('express-ejs-layouts');
const session = require('express-session');
const MongoDBSession = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');


const app = express();
const port = 5000;

//// MONGO DB CONFIGURATION
const mongoURI = 'mongodb://localhost:27017/triplef';

mongoose.connect(mongoURI,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  }
).then(res => {
  console.log('MongoDB Connected');
});

const store = new MongoDBSession({
  uri: mongoURI,
  collection: 'session',
});


app.use(
  session({
    secret: 'key-triplef',
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.set('view engine', 'ejs');


//// ROUTING
app.get('/', (req, res) => {
  req.session.isAuth = true;
  res.render('index');
});


app.listen(port, () => {
  console.log(`Server started on port http://localhost:${port}`);
});
const express = require('express');
// const expressLayaouts = require('express-ejs-layouts');
// const session = require('express-session');
// const MongoDBSession = require('connect-mongodb-session')(session);
// const mongoose = require('mongoose');


const app = express();
const appName = 'Share.doc';
const port = 5000;

//// MONGO DB CONFIGURATION
// const mongoURI = 'mongodb://localhost:27017/triplef';

// mongoose.connect(mongoURI,
//   {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useUnifiedTopology: true,
//   }
// ).then(res => {
//   console.log('MongoDB Connected');
// });

// const store = new MongoDBSession({
//   uri: mongoURI,
//   collection: 'session',
// });


// app.use(
//   session({
//     secret: 'key-triplef',
//     resave: false,
//     saveUninitialized: false,
//     store: store,
//   })
// );

// app.use(expressLayaouts);

app.set('view engine', 'ejs');

app.use(express.static('public'));
require('./routes/web.js')(app);

app.listen(port, () => {
  console.log(`Server started on port http://localhost:${port}`);
});
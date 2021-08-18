//// Import Node Modules
const express = require('express');
const session = require('express-session');
const MongoDBSession = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');

//// Import Models
const UserModel = require('./models/User');
const Campuss = require('./models/Campus');

//// Import Sevices
const uploadProfilePic = require('./services/upload_image');
const uploadFilePDF = require('./services/upload_file');

//// Import Middleware
const AuthenticationMiddleware = require('./middleware/authentication');

const app = express();
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


app.use(
  session({
    secret: 'key-triplef',
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.set('view engine', 'ejs');

app.use(express.static('public'));
require('./routes/web.js')(app);

app.listen(port, () => {
  console.log(`Server started on port http://localhost:${port}`);
});
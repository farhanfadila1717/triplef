const express = require('express');
const expressLayaouts = require('express-ejs-layouts');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const MongoDBSession = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');

const UserModel = require('./models/User');
const Campuss = require('./models/Campus');

const app = express();
const appName = 'Share.doc';
const port = 5000;

//// MONGO DB CONFIGURATION
const mongoURI = 'mongodb://localhost:27017/triplef';

app.listen(port, () => {
  console.log(`Server started on port http://localhost:${port}`);
});

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

app.use(expressLayaouts);
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

//// MIDLEWARE

const isAuth = (req, res, next) => {
  if (req.session.isAuth) {
    next();
  } else {
    res.redirect('/login');
  }
}


//// ROUTING
app.get('/', (req, res) => {
  req.session.isAuth = true;
  res.render('index', {
    layout: 'layouts/main_layout',
    title: appName,
  });
});

app.get('/login', (req, res) => {
  res.render('login', {
    layout: 'layouts/main_layout',
    title: 'Login',
  });
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });

  if (!user) {
    return res.redirect('/login');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.redirect('/login');
  }
});

app.get('/register', (req, res) => {
  res.render('register', {
    layout: 'layouts/main_layout',
    title: 'Register',
    campuss: Campuss,
  });
});

app.post('/register', async (req, res) => {
  const { name, email, password, major, graduation_year } = req.body;

  let userExisting = await UserModel.findOne({ email });

  if (userExisting) {
    return res.redirect('/register');
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  user = new UserModel(
    {
      full_name: name,
      username: name,
      email,
      password: hashedPassword,
      campus_id: 111,
      graduation_year: parseInt(graduation_year),
      major_name: major,
    }
  );
  await user.save();

  res.redirect('/login');
});
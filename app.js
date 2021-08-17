//// Import Node Modules
const express = require('express');
const expressLayaouts = require('express-ejs-layouts');
const bcrypt = require('bcryptjs');
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

//// ROUTING
app.get('/', AuthenticationMiddleware.isExisistingAuth, (req, res) => {
  res.render('index', {
    layout: 'layouts/main_layout',
    title: appName,
  });
});

app.get('/login', AuthenticationMiddleware.isExisistingAuth, (req, res) => {
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

  req.session.isAuth = true;
  req.session.user = user;
  res.redirect('/home');
});

app.get('/register', AuthenticationMiddleware.isExisistingAuth, (req, res) => {
  res.render('register', {
    layout: 'layouts/main_layout',
    title: 'Register',
    campuss: Campuss,
  });
});

app.post('/register', uploadProfilePic.single('profile_pic'), async (req, res) => {
  const { name, email, password, major, graduation_year, campus_id } = req.body;
  let userExisting = await UserModel.findOne({ email });


  const fileName = req.file.filename;

  if (userExisting) {
    return res.redirect('/register');
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  user = new UserModel(
    {
      full_name: name,
      email,
      password: hashedPassword,
      major,
      profile_pic_url: fileName,
      campus_id,
      graduation_year: parseInt(graduation_year),
      date_created: Date.now(),
    }
  );
  await user.save();

  console.log(user._id);
  req.session.isAuth = true;
  req.session.user = user;
  res.redirect('/home');
});

app.get('/home', AuthenticationMiddleware.isAuth, (req, res) => {
  res.render('home', {
    layout: 'layouts/main_layout',
    title: 'Home',
    user: req.session.user,
  });
});

app.post('/upload', uploadProfilePic.single('profile_pic'), (req, res) => {
  console.log(req.file.filename);
  res.send("Success uploaded");
});

app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) throw err;
    res.redirect("/login");
  });
});
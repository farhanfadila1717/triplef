//// ROUTING
const bcrypt = require('bcryptjs');
const appName = 'Share.doc';

//// Import Models
const UserModel = require('../models/User');
const Campuss = require('../models/Campus');
const PostingModel = require('../models/Posting');
const DownloadModel = require('../models/Download');

//// Import Sevices
const uploadProfilePic = require('../services/upload_image');
const uploadFilePDF = require('../services/upload_file');
const searchArray = require('../services/search_array');

//// Import Middleware
const AuthenticationMiddleware = require('../middleware/authentication');


module.exports = (app) => {
  app.get('/', async (req, res) => {

    let posting = await PostingModel.find();

    res.render('page/index', {
      layout: 'layout/main_layout',
      title: appName,
      page_name: 'home',
      campuss: Campuss.slice(0, 3),
      userSession: req.session.userSession ?? '',
      posting: posting ?? [],
    });
  })

  app.get('/library', (req, res) => {
    res.render('page/library', {
      layout: 'layout/main_layout',
      title: appName,
      page_name: 'library',
      userSession: req.session.userSession ?? '',
    });
  })

  app.get('/university', (req, res) => {
    res.render('page/university', {
      layout: 'layout/main_layout',
      title: appName,
      page_name: 'university',
      campuss: Campuss,
      userSession: req.session.userSession ?? '',
    });
  })

  app.get('/detail-university', (req, res) => {
    const campuss_id = req.query.id ?? '111';
    const campuss = searchArray.getObject(Campuss, 'campuss_id', campuss_id)[0];

    res.render('page/detail-university', {
      layout: 'layout/main_layout',
      title: appName,
      page_name: 'university',
      campuss,
      userSession: req.session.userSession ?? '',
    });
  });

  app.get('/upload', AuthenticationMiddleware.isAuth, (req, res) => {
    res.render('page/upload', {
      layout: 'layout/main_layout',
      title: 'Upload',
      page_name: 'upload',
      userSession: req.session.userSession ?? '',
    });
  });


  app.post('/upload', uploadFilePDF.single('document'), async (req, res) => {
    const { title, description, category, posting_type } = req.body;
    const userSession = req.session.userSession;
    const document_url = req.file.filename;

    const userPosting = {
      name: userSession.name,
      email: userSession.email,
      profile_pic_url: userSession.profile_pic_url,
      campuss_id: userSession.campuss_id,
      campuss_name: userSession.campuss_name,
      year: userSession.year,
    }

    const posting = new PostingModel({
      user: userPosting,
      title,
      description,
      category,
      document_url,
      posting_type,
      date_created: Date.now(),
    });

    await posting.save();

    res.redirect('/');
  });

  app.get('/profile-mobile', AuthenticationMiddleware.isAuth, (req, res) => {
    res.render('page/profile-mobile', {
      layout: 'layout/main_layout',
      title: appName,
      page_name: 'profile-mobile',
    })
  })

  app.get('/edit-profile', AuthenticationMiddleware.isAuth, (req, res) => {
    res.render('page/edit-profile', {
      layout: 'layout/main_auth',
      title: appName,
      page_name: 'edit-profile',
      userSession: req.session.userSession ?? '',
    })
  })

  app.get('/login', AuthenticationMiddleware.isExisistingAuth, (req, res) => {
    const message = req.query.message ?? '';

    res.render('login', {
      layout: 'layout/main_auth',
      title: 'login',
      message,
    });
  });

  app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    let user = await UserModel.findOne({ email });

    if (!user) {
      const message = encodeURIComponent('Email tidak terdaftar');
      return res.redirect('/login?message=' + message);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.redirect('/login');
    }

    const campuss = searchArray.getObject(Campuss, 'campuss_id', user.campuss_id)[0];

    const userSession = {
      id: user._id,
      name: user.name,
      email: user.email,
      profile_pic_url: user.profile_pic_url,
      year: user.year,
      description: user.description,
      campuss_id: user.campuss_id,
      campuss_name: campuss.campuss_name,
      download: 0,
      privat: 0,
      public: 0,
    };
    req.session.isAuth = true;
    req.session.userSession = userSession;

    res.redirect('/');
  });

  app.get('/register', (req, res) => {
    res.render('register', {
      layout: 'layout/main_auth',
      title: 'Register',
      campuss: Campuss,
    })
  });

  app.post('/register', uploadProfilePic.single('profile_pic'), async (req, res) => {

    const { name, email, password, year, description, campuss_id } = req.body;

    let existingUser = await UserModel.findOne({ email });
    const profilePic = req.file.filename;

    if (existingUser) {
      return res.redirect('/register');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    user = new UserModel({
      name,
      email,
      password: hashedPassword,
      profile_pic_url: profilePic,
      campuss_id: campuss_id,
      year: parseInt(year),
      description,
      date_created: Date.now(),
    });

    await user.save();
    const campuss = searchArray.getObject(Campuss, 'campuss_id', campuss_id)[0];

    const userSession = {
      id: user._id,
      name: user.name,
      year: user.year,
      email: user.email,
      profile_pic_url: user.profile_pic_url,
      description: user.description,
      campuss_id: user.campuss_id,
      campuss_name: campuss.campuss_name,
      download: 0,
      privat: 0,
      public: 0,
    };
    req.session.isAuth = true;
    req.session.userSession = userSession;
    res.redirect('/');
  });

  app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) throw err;
      res.redirect("/login");
    });
  });
}
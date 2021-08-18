//// ROUTING
const express = require('express');
const bcrypt = require('bcryptjs');
const appName = 'Share.doc';

//// Import Models
const UserModel = require('../models/User');
const Campuss = require('../models/Campus');

//// Import Sevices
const uploadProfilePic = require('../services/upload_image');
const uploadFilePDF = require('../services/upload_file');
const searchArray = require('../services/search_array');

//// Import Middleware
const AuthenticationMiddleware = require('../middleware/authentication');


module.exports = (app) => {
  app.get('/', (req, res) => {
    res.render('page/index', {
      layout: 'layout/main_layout',
      title: appName,
      page_name: 'home',
      user: req.session.user ?? '',
    })
  })

  app.get('/library', (req, res) => {
    res.render('page/library', {
      layout: 'layout/main_layout',
      title: appName,
      page_name: 'library',
      user: req.session.user ?? '',
    })
  })

  app.get('/university', (req, res) => {
    res.render('page/university', {
      layout: 'layout/main_layout',
      title: appName,
      page_name: 'university',
      campuss: Campuss,
      user: req.session.user ?? '',
    })
  })

  app.get('/detail-university', (req, res) => {

    const campuss_id = req.query.id ?? '111';

    const campuss = searchArray.getObject(Campuss, 'campuss_id', campuss_id)[0];


    res.render('page/detail-university', {
      layout: 'layout/main_layout',
      title: appName,
      page_name: 'university',
      user: req.session.user ?? '',
      campuss,
    })
  })

  app.get('/upload', AuthenticationMiddleware.isAuth, (req, res) => {
    res.render('page/upload', {
      layout: 'layout/main_layout',
      title: 'Upload',
      page_name: 'upload',
    })
  })

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

    req.session.isAuth = true;
    req.session.user = user;

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

    req.session.isAuth = true;
    req.session.user = user;
    res.redirect('/');
  });

  app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) throw err;
      res.redirect("/login");
    });
  });
}
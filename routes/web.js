//// ROUTING
const express = require('express');
const appName = 'Share.doc';

//// Import Models
const UserModel = require('../models/User');
const Campuss = require('../models/Campus');

//// Import Sevices
const uploadProfilePic = require('../services/upload_image');
const uploadFilePDF = require('../services/upload_file');

//// Import Middleware
const AuthenticationMiddleware = require('../middleware/authentication');


module.exports = (app) => {
  app.get('/', (req, res) => {
    res.render('page/index', {
      layout: 'layout/main_layout',
      title: appName,
      page_name: 'home',
    })
  })

  app.get('/library', (req, res) => {
    res.render('page/library', {
      layout: 'layout/main_layout',
      title: appName,
      page_name: 'library',
    })
  })

  app.get('/university', (req, res) => {
    res.render('page/university', {
      layout: 'layout/main_layout',
      title: appName,
      page_name: 'university',
    })
  })

  app.get('/detail-university', (req, res) => {
    res.render('page/detail-university', {
      layout: 'layout/main_layout',
      title: appName,
      page_name: 'university',
    })
  })

  app.get('/upload', (req, res) => {
    res.render('page/upload', {
      layout: 'layout/main_layout',
      title: appName,
      page_name: 'upload',
    })
  })

  app.get('/profile-mobile', (req, res) => {
    res.render('page/profile-mobile', {
      layout: 'layout/main_layout',
      title: appName,
      page_name: 'profile-mobile',
    })
  })

  app.get('/edit-profile', (req, res) => {
    res.render('page/edit-profile', {
      layout: 'layout/main_auth',
      title: appName,
      page_name: 'edit-profile',
    })
  })

  app.get('/login', (req, res) => {
    res.render('login', {
      layout: 'layout/main_auth',
      title: 'login',
    });
  });

  app.post('/login', (req, res) => {
    console.log(req.body);
    res.redirect('/');
  });

  app.get('/register', (req, res) => {
    res.render('register', {
      layout: 'layout/main_auth',
      title: 'register',
    })
  })
}
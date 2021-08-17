//// ROUTING
const express = require('express');
const app = express();
const appName = 'Share.doc';
module.exports = (app) => {

    app.get('/', (req, res) => {
        // req.session.isAuth = true;
        res.render('layout/main_layout', {
            layout: '../page/index',
            title: appName,
            page_name: 'home',
        })
    })

    app.get('/library', (req, res) => {
        // req.session.isAuth = true;
        res.render('layout/main_layout', {
            layout: '../page/library',
            title: appName,
            page_name: 'library',
        })
    })

    app.get('/university', (req, res) => {
        // req.session.isAuth = true;
        res.render('layout/main_layout', {
            layout: '../page/university',
            title: appName,
            page_name: 'university',
        })
    })

    app.get('/detail-university', (req, res) => {
        // req.session.isAuth = true;
        res.render('layout/main_layout', {
            layout: '../page/detail-university',
            title: appName,
            page_name: 'university',
        })
    })

    app.get('/upload', (req, res) => {
        // req.session.isAuth = true;
        res.render('layout/main_layout', {
            layout: '../page/upload',
            title: appName,
            page_name: 'upload',
        })
    })

    app.get('/profile-mobile', (req, res) => {
        // req.session.isAuth = true;
        res.render('layout/main_layout', {
            layout: '../page/profile-mobile',
            title: appName,
            page_name: 'profile-mobile',
        })
    })

    app.get('/edit-profile', (req, res) => {
        // req.session.isAuth = true;
        res.render('layout/main_layout', {
            layout: '../page/edit-profile',
            title: appName,
            page_name: 'edit-profile',
        })
    })

    app.get('/login', (req, res) => {
        res.render('layout/main_auth', {
            layout: '../login',
            title: 'login',
        })
    })

    app.get('/register', (req, res) => {
        res.render('layout/main_auth', {
            layout: '../register',
            title: 'register',
        })
    })

    // app.get('/register', (req, res) => {
    //     res.render('main_layout', {
    //         layout: 'register',
    //         main_css: './temp/main_css',
    //         main_js: './temp/main_js',
    //         title: 'register',
    //     })
    // })

}
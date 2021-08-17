//// ROUTING
const express = require('express');
const app = express();
const appName = 'Share.doc';
module.exports = (app) => {

    app.get('/', (req, res) => {
        // req.session.isAuth = true;
        res.render('main_layout', {
            layout: 'index',
            title: appName,
        })
    })

    // app.get('/login', (req, res) => {
    //     res.render('main_layout', {
    //         layout: 'login',
    //         main_css: './temp/main_css',
    //         main_js: './temp/main_js',
    //         title: 'login',
    //     })
    // })

    // app.get('/register', (req, res) => {
    //     res.render('main_layout', {
    //         layout: 'register',
    //         main_css: './temp/main_css',
    //         main_js: './temp/main_js',
    //         title: 'register',
    //     })
    // })

}
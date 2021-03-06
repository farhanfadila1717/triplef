//// INJECT
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const fs = require('fs');
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

var done = true;


module.exports = (app) => {
  app.get('/', async (req, res) => {


    let popular = await PostingModel.find({ posting_type: 'Public', isRemoved: false }).sort({
      download_count: -1,
    }).limit(3);

    if (req.session.isAuth !== null && req.session.isAuth) {
      let posting = await PostingModel.aggregate([
        { "$match": { "posting_type": "Public", "isRemoved": false } },
        { "$sort": { "date_created": -1, "download_count": -1 } },
        {
          "$lookup": {
            "from": "users",
            "localField": "email",
            "foreignField": "email",
            "as": "user",
          },
        },
        {
          $set: {
            user: {
              $arrayElemAt: ["$user", 0]
            }
          }
        }
      ]);
      return res.render('page/home', {
        layout: 'layout/main_layout',
        title: appName,
        page_name: 'home',
        campuss: Campuss.slice(0, 3),
        userSession: req.session.userSession ?? '',
        posting: posting ?? [],
        popular: popular ?? [],
      });
    } else {
      return res.render('index', {
        layout: 'layout/main_auth',
        title: appName,
        page_name: 'home',
      });
    }
  });

  app.get('/library', AuthenticationMiddleware.isAuth, async (req, res) => {

    let posting = await PostingModel.aggregate([
      { "$match": { "isRemoved": false, "email": req.session.userSession.email } },
    ]);


    let download = await DownloadModel.findOne({ email: req.session.userSession.email });
    let downloadedPosting;

    if (download !== null) {
      ids = download.postings_id.map(function (el) { return mongoose.Types.ObjectId(el) });
      downloadedPosting = await PostingModel.aggregate([
        { "$match": { "posting_type": "Public", "isRemoved": false, "_id": { "$in": ids } } },
        { "$sort": { "date_created": -1 } },
        {
          "$lookup": {
            "from": "users",
            "localField": "email",
            "foreignField": "email",
            "as": "user",
          },
        },
        {
          $set: {
            user: {
              $arrayElemAt: ["$user", 0]
            }
          }
        }
      ]);
    }

    const public = searchArray.getObject(posting, 'posting_type', 'Public');
    const private = searchArray.getObject(posting, 'posting_type', 'Private');



    res.render('page/library', {
      layout: 'layout/main_layout',
      title: appName,
      page_name: 'library',
      userSession: req.session.userSession ?? '',
      public: public ?? [],
      private: private ?? [],
      download: downloadedPosting ?? [],
    });
  });

  app.get('/university', (req, res) => {
    res.render('page/university', {
      layout: 'layout/main_layout',
      title: appName,
      page_name: 'university',
      campuss: Campuss,
      userSession: req.session.userSession ?? '',
    });
  })

  app.get('/detail-university', async (req, res) => {
    const campuss_id = req.query.id ?? '111';
    const campuss = searchArray.getObject(Campuss, 'campuss_id', campuss_id)[0];
    const posting = await PostingModel.aggregate([
      { "$match": { "posting_type": "Public", "isRemoved": false, "campuss.campuss_id": campuss_id } },
      { "$sort": { "date_created": -1 } },
      {
        "$lookup": {
          "from": "users",
          "localField": "email",
          "foreignField": "email",
          "as": "user",
        },
      },
      {
        $set: {
          user: {
            $arrayElemAt: ["$user", 0]
          }
        }
      }
    ]);

    res.render('page/detail-university', {
      layout: 'layout/main_layout',
      title: campuss.campuss_name,
      page_name: 'university',
      campuss,
      userSession: req.session.userSession ?? '',
      posting: posting ?? [],
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
    const { title, description, category, posting_type, source } = req.body;
    const userSession = req.session.userSession;
    const document_url = req.file.filename;

    const posting = new PostingModel({
      email: userSession.email,
      campuss: {
        campuss_id: userSession.campuss_id,
        campuss_name: userSession.campuss_name,
      },
      title,
      description,
      category,
      document_url,
      source,
      posting_type,
      date_created: Date.now(),
    });

    await posting.save();

    if (posting_type == 'Private') {
      res.redirect('/library');
    } else {
      res.redirect('/');
    }
  });

  app.get('/profile-mobile', AuthenticationMiddleware.isAuth, (req, res) => {
    res.render('page/profile-mobile', {
      layout: 'layout/main_layout',
      title: "Profile",
      page_name: 'Profile',
      userSession: req.session.userSession ?? '',
    });
  });

  app.get('/edit-profile', AuthenticationMiddleware.isAuth, (req, res) => {
    res.render('page/edit-profile', {
      layout: 'layout/main_auth',
      title: appName,
      page_name: 'edit-profile',
      userSession: req.session.userSession ?? '',
      campuss: Campuss,
    });
  });

  app.post('/edit-profile', uploadProfilePic.single('profile_pic'), async (req, res) => {
    var objForUpdate = {};
    var objPostUpdate = {};
    const { name, year, description, campuss_id } = req.body;


    if (name && name !== req.session.userSession.name) {
      objForUpdate.name = name;
      objPostUpdate.name = name;
      req.session.userSession.name = name;
    };
    if (year && parseInt(year) !== req.session.userSession.year) {
      objForUpdate.year = year;
      objPostUpdate.year = year;
      req.session.userSession.year = year;
    };
    if (description && description !== req.session.userSession.description) {
      objForUpdate.description = description;
      req.session.userSession.description = description;
    }
    if (campuss_id && campuss_id !== req.session.userSession.campuss_name && campuss_id !== req.session.userSession.campuss_id) {
      objForUpdate.campuss_id = campuss_id;
      const campuss = searchArray.getObject(Campuss, 'campuss_id', campuss_id)[0];
      req.session.userSession.campuss_name = campuss.campuss_name;
      objPostUpdate.campuss_name = campuss.campuss_name;
      req.session.userSession.campuss_id = campuss_id;
    };

    try {
      if (req.file.filename !== null) {
        objForUpdate.profile_pic_url = req.file.filename;
        req.session.userSession.profile_pic_url = req.file.filename;
        objPostUpdate.profile_pic_url = req.file.filename;
      }
    } catch (e) { }

    if (Object.keys(objForUpdate).length > 0) {
      let user = await UserModel.findByIdAndUpdate(req.session.userSession.id, objForUpdate);
      if (user) {
        return res.redirect('/');
      }
    }

    res.redirect('/edit-profile');

  });

  app.get('/login', AuthenticationMiddleware.isExisistingAuth, (req, res) => {
    const message = req.query.message ?? '';

    res.render('login', {
      layout: 'layout/main_auth',
      title: 'Login',
      message,
    });
  });

  app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    let user = await UserModel.findOne({ email }).select("+password");

    if (!user) {
      const message = encodeURIComponent('Email tidak terdaftar');
      return res.redirect('/login?message=' + message);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.redirect('/login');
    }

    const campuss = searchArray.getObject(Campuss, 'campuss_id', user.campuss_id)[0];
    const download = await DownloadModel.findOne({ email: user.email });

    var download_count = 0;

    if (download !== null && download.postings_id !== null) {
      download.postings_id.forEach(element => {
        download_count++;
      });
    }

    const userSession = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      profile_pic_url: user.profile_pic_url,
      year: user.year,
      description: user.description,
      campuss_id: user.campuss_id,
      campuss_name: campuss.campuss_name,
      download: download_count,
      private: 0,
      public: 0,
    };
    req.session.isAuth = true;
    req.session.userSession = userSession;

    res.redirect('/');
  });

  app.get('/register', AuthenticationMiddleware.isExisistingAuth, (req, res) => {
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
      id: user._id.toString(),
      name: user.name,
      year: user.year,
      email: user.email,
      profile_pic_url: user.profile_pic_url,
      description: user.description,
      campuss_id: user.campuss_id,
      campuss_name: campuss.campuss_name,
      download: 0,
      private: 0,
      public: 0,
    };
    req.session.isAuth = true;
    req.session.userSession = userSession;
    res.redirect('/');
  });

  app.get('/logout', AuthenticationMiddleware.isAuth, (req, res) => {
    req.session.destroy((err) => {
      if (err) throw err;
      res.redirect("/");
    });
  });

  app.get('/document', async (req, res) => {
    let document = await PostingModel.findById(req.query.file);
    const name = `${document.title}_share.doc_${Date.now()}.pdf`;

    if (document) {
      res.download(`public/document/${document.document_url}`, name);

      if (req.session.userSession !== null) {
        if (req.session.userSession.email !== document.email) {
          const user = req.session.userSession;
          let download = await DownloadModel.findOne({ email: user.email });
          req.session.userSession.download++;
          if (done) {
            await PostingModel.findByIdAndUpdate(req.query.file, { download_count: document.download_count + 1 });
          }
          done = false;
          setTimeout(() => {
            done = true;
          }, 10000);
          if (download !== null) {
            await DownloadModel.findOneAndUpdate({ email: user.email }, {
              $addToSet: {
                postings_id: req.query.file,
              }
            });
            return;
          } else {
            firstDownload = new DownloadModel({
              email: user.email,
              postings_id: [req.query.file],
              date_created: Date.now(),
              date_updated: Date.now(),
            });
            await firstDownload.save();
            return;
          }
        }
      }
    } else {
      res.redirect('/');
    }
  });

  app.get('/remove', async (req, res) => {
    const id = req.query.id;
    await PostingModel.findByIdAndUpdate(id, { isRemoved: true });
    res.redirect('/library');
  });

  app.get('*', (req, res) => {
    res.render('404', {
      layout: 'layout/main_auth',
      title: '404 Not Found',
    })
  });
}
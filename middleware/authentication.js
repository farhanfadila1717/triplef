const isAuth = (req, res, next) => {
  if (req.session.isAuth) {
    next();
  } else {
    res.redirect('/login');
  }
}

const isExisistingAuth = (req, res, next) => {
  if (req.session.isAuth && req.session.user !== null) {
    return res.redirect('/home');
  } else {
    return next();
  }
}

exports.isAuth = isAuth;
exports.isExisistingAuth = isExisistingAuth;
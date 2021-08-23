const isAuth = (req, res, next) => {
  try {
    if (req.session.isAuth) {
      next();
    } else {
      res.redirect('/login');
    }
  } catch (e) {
    res.redirect('/login');
  }
}

const isExisistingAuth = (req, res, next) => {
  if (req.session.isAuth && req.session.userSession !== null) {
    return res.redirect('/');
  } else {
    return next();
  }
}

exports.isAuth = isAuth;
exports.isExisistingAuth = isExisistingAuth;
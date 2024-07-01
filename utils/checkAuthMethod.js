import passport from "passport";

const checkAuthMethod = (req, res, next) => {
  if (req.session && req.session.user) {
    req.user = {
      first_name: req.session.user.first_name,
      last_name: req.session.user.last_name,
      email: req.session.user.email,
      role: req.session.user.role,
      cart: req.session.user.cart,
      _id: req.session.user._id
    };
    next();
  } else {
    passport.authenticate('jwt', { session: false })(req, res, next);
  }
};

export default checkAuthMethod;

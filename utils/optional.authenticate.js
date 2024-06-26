import passport from "passport";
import jwt from "jsonwebtoken";

const optionalAuthenticate = (req, res, next) => {
  
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
    
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
      if (err) return next(err);
      if (user) req.user = user; 
      next();
    })(req, res, next);
  }
};

export default optionalAuthenticate;

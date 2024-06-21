import passport from "passport";
import jwt from "jsonwebtoken";

const optionalAuthenticate = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (user) req.user = user;
    next();
  })(req, res, next);
};

export default optionalAuthenticate;
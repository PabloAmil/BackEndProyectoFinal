import passport from "passport";
import GitHubStrategy from "passport-github2";
import { Strategy } from "passport-jwt";
import cartsDAO from "./mongoDbManagers/cartsDbManager.js";
import config from "../config/config.js";
import userService from "../repositories/usersRepository.js";
import getConnectionTime from "../../utils/getConnectionTime.js";
import jwt from "jsonwebtoken";

const initializePassport = () => {

  passport.use('github', new GitHubStrategy({

    clientID: config.client_Id,
    clientSecret: config.client_secret,
    callbackURL: config.callback_url
  }, async (accesToken, refreshToken, profile, done) => {
    try {

      let user = await userService.getUsersByEmail(profile._json.email);

      const newCart = await cartsDAO.createNewCart();
      const cartId = newCart._id;

      if (!user) {
        let newUser = await userService.formatGithubDataForDAO(profile._json, cartId);
        let result = await userService.insertUser(newUser)
        done(null, result);

      } else {  
        
        const connectionTime = getConnectionTime();
        user.last_conection = connectionTime;
        let updatedUser = await userService.updateUsers(user.email, user);
        let storedUser = await userService.returnFormatedDataFromDAO(user);
        const token = jwt.sign({ id: storedUser._id }, config.jwt_secret, { expiresIn: '1h' });

        done(null, storedUser);
      }
    } catch (e) {
      return done(e);
    }
  }))

  passport.serializeUser((storedUser, done) => {
    done(null, storedUser._id);
  })

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await userService.getUserById(id)
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  })

  passport.use('jwt', new Strategy({
    jwtFromRequest: (req) => {
      let token = null;
      if (req && req.signedCookies) {
        token = req.signedCookies['jwt'];
      }
      return token;
    },
    secretOrKey: config.jwt_secret
  }, async (jwt_payload, done) => {
    let userId = jwt_payload.id;
    let user = await userService.getUserById(userId);
    let storedUser =  await userService.returnFormatedDataFromDAO(user)

    if (storedUser) {
      return done(null, storedUser);
    } else {
      return done(null, false);
    }
  }));
}
export default initializePassport;


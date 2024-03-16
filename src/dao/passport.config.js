import passport from "passport";
import GitHubStrategy from "passport-github2";
import UsersDAO from "./mongoDbManagers/usersDbManager.js";
import { createHash, isValidPassword } from "../../utils/crypt.js";
import { Strategy } from "passport-jwt";


const initializePassport = () => {

  passport.use('github', new GitHubStrategy({

    clientID: "Iv1.7bedaeb477a40f46",
    clientSecret: "b8aca51c95f34280c853cd47d45a8ba4b2430500",
    callbackURL: "http://localhost:8080/api/sessions/githubcallback"
  }, async (accesToken, refreshToken, profile, done) => {
    try {

      let user = await UsersDAO.getUsersByEmail(profile._json.email);

      if (!user) {
        let newUser = {
          first_name: profile._json.name,
          last_name: "",
          age: 18,
          email: profile._json.email,
          password: ""
        }

        let result = await UsersDAO.insert(newUser.first_name, newUser.last_name, newUser.age, newUser.email, newUser.password);
        done(null, result);
      } else {
        done(null, user);
      }
    } catch (e) {
      return done(e);
    }
  }))


  passport.use('jwt', new Strategy({
    jwtFromRequest: (req) => {
      let token = null;
      if (req && req.signedCookies) {
        token = req.signedCookies['jwt'];
      }
      return token;
    },
    secretOrKey: "secret_jwt"
  }, async (jwt_payload, done) => {
    let userId = jwt_payload.id;
    let user = await UsersDAO.getUserById(userId);

    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  }));

  
}
export default initializePassport;
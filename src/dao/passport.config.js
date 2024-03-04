import { Strategy } from "passport-local";
import { createHash } from "../../utils/crypt.js";
import passport from "passport";
import GitHubStrategy from "passport-github2";
import UsersDAO from "./mongoDbManagers/usersDbManager.js";

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

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await UsersDAO.getUserById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
  

}
export default initializePassport;
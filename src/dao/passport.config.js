import passport from "passport";
import GitHubStrategy from "passport-github2";
import UsersDAO from "./mongoDbManagers/usersDbManager.js";
import LocalStrategy from "passport-local";
import { createHash, isValidPassword } from "../../utils/crypt.js";

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

  // passport en register y login

  passport.use('register', new LocalStrategy(
    {passReqToCallback:true, usernameField: 'email'}, async (req, username, password, done) => {
      const {first_name, last_name, email, age} = req.body;

      try {
        let user = await UsersDAO.getUsersByEmail(email); 

        if (user) {
          console.log('User already exists');
          return done(null,false);
        } 

        const newUser = {
          first_name,
          last_name,
          email,
          age,
          passport: createHash(password)
        }

        let result = await UsersDAO.insert(newUser.first_name, newUser.last_name, newUser.age, newUser.email, newUser.passport);
        return done(null, result);

      } catch (error) {
        return done("Could not create user" + error);
      }
    }
  ));

  passport.use('login', new LocalStrategy({usernameField: 'email'}, async (username, password, done) => {

    try {

      const user = await UsersDAO.getUsersByEmail(username); 

      if (!user) {
        console.log('Could not find user')
        return done (null, false)
      }

      if (!isValidPassword(password, user.password)) return done (null, false);
      return done (null, user);
    } catch (error) { 
      return done(error);
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
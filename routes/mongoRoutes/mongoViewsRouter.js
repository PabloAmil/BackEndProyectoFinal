import { Router, query } from "express";
import UsersDAO from "../../src/dao/mongoDbManagers/usersDbManager.js";
import passport from "passport";
import logger from "../../app.js";
import checkDate from "../../utils/dateChecker.js";
import checkAuthMethod from "../../utils/checkAuthMethod.js";

const router = Router();

router.get('/', (req, res) => {
  res.redirect('/home');
})

router.get('/home', (req, res) => { 

  if (req.user) {
    res.redirect("/profile");
  } 
  else {
    res.render("home");
  }
})

router.get('/register', (req, res) => {
  res.render("register", {
    style: "register.css"
  });
});

router.get("/login", (req, res)=> { 

  if (req.session) {
    req.session.destroy;
  }

  if (req.user || req.session.user) {
    res.redirect("/profile");
  } else {
    res.render("login", {
      style: "login.css"
    });
  }
})

router.get("/profile", checkAuthMethod, async (req, res) => {
  try {
    if (req.user) {

      console.log(req.user);

      let user = await UsersDAO.getUserById(req.user._id);
      res.render("profile", {
        user,
        style: "profile.css"
      });
    } else {
      res.redirect("/login");
    }
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/reset-password", (req, res) => {
  res.render("reset-password");
})

router.get("/change-password", (req, res)=> {

  if (checkDate(req.query.date)) {
    res.render("reset-password");
  } else {
    res.render("change-password");
  }
});

router.get("/loggerTest", (req, res) => {
  logger.fatal('this is a fatal error test log');
  logger.error('this is an error test log');
  logger.warning('this is a warning test log');
  logger.info('this is an info test log');
  logger.http('this is an http test log');
  logger.debug('this is a debug test log');

  res.send('testing logs')

})

export default router;
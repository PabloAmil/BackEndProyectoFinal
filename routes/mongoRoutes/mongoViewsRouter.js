import { Router, query } from "express";
import UsersDAO from "../../src/dao/mongoDbManagers/usersDbManager.js";
import passport from "passport";
import logger from "../../app.js";
import checkDate from "../../utils/dateChecker.js";

const router = Router();

router.get('/', (req, res) => {
  res.redirect('/home');
})

router.get('/home', (req, res) => { 

  if (req.user) {
    res.render("profile");
  } 
  else {
    res.render("home");
  }
})

router.get('/register', (req, res)=> {
  res.render("register");
})

router.get("/login", (req, res)=> { 

  if (req.user) {
    res.redirect("/profile");
  } else {
    res.render("login");
  }
})

router.get("/profile",  passport.authenticate("jwt", {session: false}), async (req, res)=> {

  if (req.user) {
    let user = await UsersDAO.getUserById(req.user._id);

    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
    console.log(req.user)

    res.render("profile", {user});
  } else {
    
    res.redirect("/login");
  }
}) 

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
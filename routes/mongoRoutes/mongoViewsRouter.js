import { Router } from "express";
import UsersDAO from "../../src/dao/mongoDbManagers/usersDbManager.js";
import passport from "passport";

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
    res.render("profile", {user});
  } else {
    res.redirect("/login");
  }
}) 

router.get("/change-password", (req, res)=> {
  res.render("change-password");
});

export default router;
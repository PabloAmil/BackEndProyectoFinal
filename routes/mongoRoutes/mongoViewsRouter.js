import { Router } from "express";
import UsersDAO from "../../src/dao/mongoDbManagers/usersDbManager.js";

const router = Router();

router.get('/', (req, res) => {
  res.redirect('/home');
})

router.get('/home', (req, res) => {

  if (req.session.user) {
    res.redirect("/profile")
  } else {
    res.render("home");
  }
})

router.get('/register', (req, res)=> {
  res.render("register");
})

router.get("/login", (req, res)=> {

  if (req.session.user) {
    res.redirect("/profile");
  } else {
    res.render("login");

  }
})

router.get("/profile", async (req, res)=> {
  if (req.session.user) {
    let user = await UsersDAO.getUserById(req.session.user);
    res.render("profile", {user});
  } else {
    res.redirect("/login");
  }
}) 

export default router;
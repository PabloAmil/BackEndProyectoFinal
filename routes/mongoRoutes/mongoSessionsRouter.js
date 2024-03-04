import { Router } from "express";
import UsersDAO from "../../src/dao/mongoDbManagers/usersDbManager.js";
import { createHash, isValidPassword } from "../../utils/crypt.js";
import passport from "passport";

const router = Router();

router.post('/register', async (req, res) => {

  let first_name = req.body.first_name;
  let last_name = req.body.last_name;
  let email = req.body.email;
  let age = parseInt(req.body.age);
  let password = req.body.password;

  if (!first_name || !last_name || !email || !age || !password) {
    res.redirect("/register");
  }

  let emailUsed = await UsersDAO.getUsersByEmail(email);

  if (emailUsed) {
    res.redirect("/register");
  } else {
    await UsersDAO.insert(first_name, last_name, age, email, createHash(password));
    res.redirect("/login");
  }
})

router.post("/login", async (req, res) => {

  let email = req.body.email;
  let password = req.body.password;
  if (!email || !password) {
    res.redirect("/login")
  }
  let user = await UsersDAO.getUsersByEmail(email);

  if (!user) { 
    res.redirect("/login");
  } else {

    if (isValidPassword(password, user?.password)) { 
      req.session.user = user.first_name; 
      req.session.last_name = user.last_name;

      if (user.role === "Admin") {
        req.session.role = user.role; 
      }                              
      res.redirect("/api/products");

    } else {
      res.redirect("/login")
    }
  }
});

router.post("/change-password", async (req, res)=> {

  let email = req.body.email;
  let password = req.body.password;
  if (!email || !password) {
    res.redirect("/change-password")
  }
  
  try {
    let user = await UsersDAO.getUsersByEmail(email);

    user.password = createHash(password);
    await UsersDAO.updateUser(email, user);
    res.status(200).send('password changed');
    
  } catch (error) {
    res.status(500).send("Unable to modify user password");
  }
})

router.get('/github', passport.authenticate('github', {scope: ['user:email']}), async (req, res) => {});
router.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/login'}), async (req, res)=> {

  req.session.user = req.user;
  res.redirect('/');
})

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    res.redirect("/login");
  })
});

export default router;
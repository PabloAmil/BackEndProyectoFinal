import { Router } from "express";
import UsersDAO from "../../src/dao/mongoDbManagers/usersDbManager.js";
import { createHash, isValidPassword } from "../../utils/crypt.js";
import passport from "passport";

const router = Router();

// router.post('/register', async (req, res) => {

//   let first_name = req.body.first_name;
//   let last_name = req.body.last_name;
//   let email = req.body.email;
//   let age = parseInt(req.body.age);
//   let password = req.body.password;

//   if (!first_name || !last_name || !email || !age || !password) {
//     res.redirect("/register");
//   }

//   let emailUsed = await UsersDAO.getUsersByEmail(email);

//   if (emailUsed) {
//     res.redirect("/register");
//   } else {
//     await UsersDAO.insert(first_name, last_name, age, email, createHash(password));
//     res.redirect("/login");
//   }
// })

// router.post("/login", async (req, res) => {

//   let email = req.body.email;
//   let password = req.body.password;
//   if (!email || !password) {
//     res.redirect("/login")
//   }
//   let user = await UsersDAO.getUsersByEmail(email);

//   if (!user) { 
//     res.redirect("/login");
//   } else {

//     if (isValidPassword(password, user?.password)) { 
//       req.session.user = user.first_name; 
//       req.session.last_name = user.last_name;

//       if (user.role === "Admin") {
//         req.session.role = user.role; 
//       }                              
//       res.redirect("/api/products");

//     } else {
//       res.redirect("/login")
//     }
//   }
// });

router.post('/register', passport.authenticate('register', {failureRedirect: '/failregister'}), async (req, res)=> {
  res.redirect('/login');
  //res.send({status: "succes", message: "user registered"});
})

router.get('/failregister', async (req, res)=> {
  res.send({stauts: "failed", message: "user registration failed"});
})

router.post('/login', passport.authenticate('login', {failureRedirect: '/faillogin'}), async (req, res) => {

  if (!req.user) return res.status(400).send({stauts: 'error', error: 'Invalid credentials'});
  req.session.user = {
    first_name: req.user.first_name,
    last_name: req.user.last_name,
    age: req.user.age,
    email: req.user.email
  };

  res.send({status: "succes", payload: req.user});
})

router.get('/faillogin', (req, res)=> {
  res.send({error: "Login failed"})
})

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
import { Router } from "express";
import UsersDAO from "../../src/dao/mongoDbManagers/usersDbManager";


const router = Router();

router.post('/register', async (req, res)=> {
  
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
    await UsersDAO.insert(first_name, last_name, age, email, password);
    res.redirect("/login");
  }
})

router.post("/login", async (req, res)=> {

  let email = req.body.email;
  let password = req.body.password; 

  if (!email || !password) {
    res.redirect("/login")
  }

  let user = UsersDAO.getUsersByCreds(email, password);

  if (!user) {
    res.redirect("login");
  } else {
    req.session.user = user._id;
    res.redirect("/profile");
  }
})

router.get("/logout", (req, res)=> {
  req.session.destroy((err)=> {
    res.redirect("/home");
  })
})

export default router;
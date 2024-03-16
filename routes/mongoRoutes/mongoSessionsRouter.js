import { Router } from "express";
import UsersDAO from "../../src/dao/mongoDbManagers/usersDbManager.js";
import { createHash, isValidPassword } from "../../utils/crypt.js";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = Router();

router.post('/register', async (req, res) => {
  const { first_name, last_name, email, age } = req.body;

  try {
    let user = await UsersDAO.getUsersByEmail(email);

    if (user) {
      console.log('User already exists');
      return done(null, false);
    }

    const newUser = {
      first_name,
      last_name,
      email,
      age,
      password: createHash(password)
    };

    let result = await UsersDAO.insert(newUser.first_name, newUser.last_name, newUser.age, newUser.email, newUser.password);
    res.send({ status: "succes", message: "user registered" });

  } catch (error) {
    res.redirect('/login');
  }
})

router.get('/failregister', async (req, res) => {
  res.send({ stauts: "failed", message: "user registration failed" });
})


router.post("/login", async (req, res) => {
  let email = req.body.email;
  let userPassword = req.body.password;

  if (!email || !userPassword) {
    res.status(400).json({ status: 400, error: "Wrong email or password" })
  }
  let user = await UsersDAO.getUsersByEmail(email);

  if (!user) {
    res.status(404).json({ status: 404, error: "User not found" })
  }

  if (!isValidPassword(userPassword, user.password)) {
    return res.status(401).json({ status: 401, error: "Invalid password" });
  }
  else {

    let token = jwt.sign({ id: user._id }, "secret_jwt", { expiresIn: "1h" })
    res.cookie("jwt", token, {
      signed: true,
      httpOnly: true,
      maxAge: 1000 * 60 * 60
    }).json({ status: 200, msg: "loggend in" })
  }
});


router.post("/change-password", async (req, res) => {

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

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => { });
router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), async (req, res) => {

  req.session.user = req.user;
  res.redirect('/');
})

router.get("/current", passport.authenticate("jwt", { session: false }), (req, res) => {
  res.json(req.user);
})

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    res.redirect("/login");
  })
});

export default router;
import { Router } from "express";
import cartsDAO from "../../src/dao/mongoDbManagers/cartsDbManager.js";
import { createHash, isValidPassword } from "../../utils/crypt.js";
import passport from "passport";
import jwt from "jsonwebtoken";
import config from "../../src/config/config.js";
import userService from "../../src/repositories/usersRepository.js";
import logger from "../../app.js";

//import checkPermissions from "../../utils/auth.middleware.js";

const router = Router();

router.post('/register', async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;

  try {
    let user = await userService.getUsersByEmail(email);

    if (user) {
      console.log('User already exists');
      return done(null, false);
    }

    // repository dedicado a carts?

    const newCart = await cartsDAO.createNewCart();
    const cartId = newCart._id;

    let newUser = await userService.formatRegisterDataForDAO({ first_name, last_name, email, age, password }, cartId);
    let result = await userService.insertUser(newUser);
    logger.info('User successfully registered');
    res.send({ status: "succes", message: "user registered" });

  } catch (error) {
    logger.error('Failed to register user', error);
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
    logger.warning('All fields must be completed to log in')
    res.status(400).json({ status: 400, error: "Wrong email or password" })
  }

  try {
    let user = await userService.getUsersByEmail(email);
    if (!user) {
      res.status(404).json({ status: 404, error: "User not found" })
    }

    if (!isValidPassword(userPassword, user.password)) {
      logger.warning('Incorrect password')
      return res.status(401).json({ status: 401, error: "Invalid password" });
    }
    else {
      logger.info(`user ${user.first_name, user.last_name} has logged in`);
      let token = jwt.sign({ id: user._id }, config.jwt_secret, { expiresIn: "1h" })
      res.cookie("jwt", token, {
        signed: true,
        httpOnly: true,
        maxAge: 1000 * 60 * 60
      }).json({ status: 200, msg: "loggend in" });
    }
  } catch (err) {
    logger.warning('User not found', err)
  }
});

router.post("/change-password", async (req, res) => {

  let email = req.body.email;
  let password = req.body.password;
  if (!email || !password) {
    logger.warning('All fields must be completed to change password')
  }
  try {
    let user = await userService.getUsersByEmail(email);
    user.password = createHash(password);
    await userService.updateUsers(email, user);
    logger.info('password changed')
    res.status(200).send('password changed');

  } catch (error) {
    logger.error("Unable to modify user password, please contact support");
    res.status(500).send("Unable to modify user password");
  }
})

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => { });
router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), async (req, res) => {

  req.session.user = req.user;
  res.redirect('/');
})

router.get("/current", passport.authenticate("jwt", { session: false }), (req, res) => {
  logger.info(JSON.stringify(req.user));
  res.json(req.user);
})

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    res.redirect("/login");
  })
});

export default router;
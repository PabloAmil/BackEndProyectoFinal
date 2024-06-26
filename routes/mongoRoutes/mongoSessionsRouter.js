import { Router } from "express";
import cartsDAO from "../../src/dao/mongoDbManagers/cartsDbManager.js";
import { createHash, isValidPassword } from "../../utils/crypt.js";
import passport from "passport";
import jwt from "jsonwebtoken";
import config from "../../src/config/config.js";
import userService from "../../src/repositories/usersRepository.js";
import logger from "../../app.js";
import transport from "../../src/config/mailing.js";
import intputChecker from "../../utils/inputChecker.js";
import getConnectionTime from "../../utils/getConnectionTime.js";
import checkAuthMethod from "../../utils/checkAuthMethod.js";
//import checkPermissions from "../../utils/auth.middleware.js";

const router = Router();

router.post('/register', async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;

  try {
    let user = await userService.getUsersByEmail(email);

    if (user) {
      logger.info('User already exists');
      return res.status(400).send({ status: "failed", message: "User already exists" });
    }

    let check = intputChecker(first_name, last_name, email, age, password);

    if (check === false) {
      logger.warning('All fields must be completed');
      return res.status(400).send({ status: "failed", message: "All fields must be completed" });
    }

    const newCart = await cartsDAO.createNewCart();
    const cartId = newCart._id;

    let newUser = await userService.formatRegisterDataForDAO({ first_name, last_name, email, age, password }, cartId); 
    let result = await userService.insertUser(newUser);

    logger.info('User successfully registered');

    //res.send({ status: "succes", message: "user registered" });
    res.status(200).redirect('/login');

  } catch (error) {
    logger.error('Failed to register user', error);
    res.status(400).send('Err');
  }
})

router.get('/failregister', async (req, res) => {
  res.send({ stauts: "failed", message: "user registration failed" });
})


router.post("/login", async (req, res) => {

  if (req.session) {
    req.session.destroy;
  }

  let email = req.body.email;
  let userPassword = req.body.password;

  if (!email || !userPassword) {
    logger.warning('All fields must be completed to log in')
    res.status(400).json({ status: 400, error: "All fields must be completed to log in" })
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
      const connectionTime = getConnectionTime();
      user.last_conection = connectionTime;
      let updatedUser = await userService.updateUsers(user.email, user);

      logger.info(`user ${user.first_name, user.last_name} has logged in`);
      let token = jwt.sign({ id: user._id }, config.jwt_secret, { expiresIn: "1h" })

      res.cookie("jwt", token, {
        signed: true,
        httpOnly: true,
        maxAge: 1000 * 60 * 60
      });

      res.status(200).redirect(`${config.serverUrl}/profile`);
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

    if (isValidPassword(password, user.password)) {
      console.log("The new password cannot be the same as the old one");
      res.redirect(`${SERVER_URL}/change-password`);
    } else {
      user.password = createHash(password); 
      await userService.updateUsers(email, user);
      logger.info('password changed')
      res.status(200).send('password changed');
    }

  } catch (error) {
    logger.error("Unable to modify user password, please contact support");
    res.status(500).send("Unable to modify user password");
  }
});


router.post("/reset-password", async (req, res) => {
  let email = req.body.email;

  if (!email) {
    res.status(400).send('Non existent email');
  }
  try {
    let user = await userService.getUsersByEmail(email);

    if (!user) {
      logger.info('user not found');
      res.redirect(`${config.serverUrl}/register`);
    }
    const requestTime = new Date();
    let userId = createHash(user._id.toString());
    let date = requestTime;
    let result = await transport.sendMail({
      from: config.gmailUSer,
      to: user.email, 
      subject: 'Password restoration',
      html: `
      <div>
        <h1> Reset Password </h1>
        <a href="${config.serverUrl}/change-password?id=${userId}&date=${date}"> <button> Reset password </button></a>
      </div>
      `,
      attachments: []
    })

    logger.info(`User ${user.email}, id: ${user.id}, requested password change`);
    res.status(200).send('An email was sent to your registered account');

  } catch (error) {
    logger.error('Something went wrong while retrieving your information', error);
    res.send('Something went wrong while retrieving your information');
  }
});

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => { });
router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), async (req, res) => {

  req.session.user = req.user;
  res.redirect('/');
})

router.get("/current", checkAuthMethod, (req, res) => {
  logger.info(JSON.stringify(req.user));
  res.json(req.user);
})

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    res.redirect("/login");
  })
});

export default router;
import { Router, query } from "express";
import upload from "../../utils/premium.files.upload.js";
import checkDocuments from "../../utils/documentation.check.js";
import passport from "passport";
import userService from "../../src/repositories/usersRepository.js";
import checkPermissions from "../../utils/auth.middleware.js";
import config from "../../src/config/config.js";

const router = Router();

router.get('/', async (req, res) => {

  try {
    let response = await userService.getUsers();
    let formatedResponse = response.map((user) => {
      return {
        first_name: user.first_name,
        email: user.email,
        role: user.role
      }
    });
    res.send(formatedResponse);

  } catch (error) {
    res.status(500).send({ error: 'An error occurred while fetching users' });
  }
});

router.get('/delete', passport.authenticate("jwt", { session: false }), checkPermissions("Admin"), async (req, res) => {
  try {
    let users = await userService.deleteOutOfDateUsers();
    res.send(users);
  } catch (error) {
    
  }
})

router.get("/premium/:uid", passport.authenticate("jwt", { session: false }), async (req, res) => {

  let id = req.params.uid;
  let user = await userService.getUserById(id);
  let conditionsAreMet = checkDocuments(user);


  if (user.role === "User" && conditionsAreMet) {
    user.role = "Premium";
    let updatedUser = await userService.updateUsers(user.email, user);
    res.status(200).send('updated to premium');
  } else if (user.role === "User" && !conditionsAreMet) {

    console.log(user.role)
    console.log(conditionsAreMet);

    res.send('Cannot update to premium, missing documents')
  } else {
    user.role = "User";
    let updatedUser = await userService.updateUsers(user.email, user);
    res.status(200).send('updated to User');
  }
});


router.get("/:uid/documents", passport.authenticate("jwt", { session: false }), async (req, res) => {
  let uid = req.params.uid;
  res.render("upload-documents", { uid });
});

router.post("/:uid/documents", passport.authenticate("jwt", { session: false }), upload.fields([
  { name: 'profile', maxCount: 1 },
  { name: 'product', maxCount: 1 },
  { name: 'document', maxCount: 10 }
]), async (req, res) => {

  let uid = req.params.uid;
  try {
    const user = await userService.getUserById(uid);
    if (!user) {
      return res.status(404).send('User not found');
    }

    if (req.files['document']) {
      req.files['document'].forEach(file => {
        user.documents.push({
          name: file.originalname,
          reference: file.path
        });
      });
    }
    let updatedUser = await userService.updateUsers(user.email, user);

    res.status(200).send('Files uploaded successfully');
  } catch (error) {
    res.status(500).send('Error uploading files');
  }
});

router.get("/admin-control-panel", passport.authenticate("jwt", { session: false }), checkPermissions("Admin"), async (req, res) => {

  let users = await userService.getUsers()
  let serverUrl = config.serverUrl;

  res.render('admin-control-panel', {
    serverUrl,
    users,
    style: "admin-control-panel.css"
  });
});

router.post("/admin-control-panel", async (req, res) => {
  try {
    let result = await userService.modifyOrDelete(req.body);
    res.status(200).json({ message: 'User modified successfully', result }); 
  } catch (error) {
    res.status(500).json({ message: 'Failed to modify an user', error: error.message }); 
  }
});

export default router;


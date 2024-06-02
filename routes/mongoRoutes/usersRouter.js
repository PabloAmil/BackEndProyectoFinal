import { Router, query } from "express";
import UsersDAO from "../../src/dao/mongoDbManagers/usersDbManager.js";
import upload from "../../utils/premium.files.upload.js";
import checkDocuments from "../../utils/documentation.check.js";
import passport from "passport";

const router = Router();

router.get("/premium/:uid",passport.authenticate("jwt", { session: false }), async (req, res) => {

  let id = req.params.uid;
  let user = await UsersDAO.getUserById(id);
  let conditionsAreMet = checkDocuments(user);


  if (user.role === "User" && conditionsAreMet) {
    user.role = "Premium";
    let updatedUser = await UsersDAO.updateUser(user.email, user);
    res.status(200).send('updated to premium');
  } else if (user.role === "User" && !conditionsAreMet){

    console.log(user.role)
    console.log(conditionsAreMet);

    res.send('Cannot update to premium, missing documents')
  } else {
    user.role = "User";
    let updatedUser = await UsersDAO.updateUser(user.email, user);
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
    const user = await UsersDAO.getUserById(uid);
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
    let updatedUser = await UsersDAO.updateUser(user.email, user);

    res.status(200).send('Files uploaded successfully');
  } catch (error) {
    res.status(500).send('Error uploading files');
  }
});

export default router;


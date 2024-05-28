import { Router, query } from "express";
import UsersDAO from "../../src/dao/mongoDbManagers/usersDbManager.js";

const router = Router();

router.get("/premium/:uid", async (req, res) => {

  let id = req.params.uid;
  let user = await UsersDAO.getUserById(id);

  if (user.role === "User") {
    user.role = "Premium";
  } else {
    user.role = "User";
  } 

  let updatedUser = await UsersDAO.updateUser(user.email, user);
  res.status(200).send(updatedUser);
})




export default router;


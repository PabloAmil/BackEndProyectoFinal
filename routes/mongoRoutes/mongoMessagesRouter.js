import { Router } from "express";
import MessagesDAO from "../../src/dao/mongoDbManagers/messagesDbManager.js";
import passport from "passport";
import checkPermissions from "../../utils/auth.middleware.js";

const router = Router();

router.get("/",  async (req, res) => {

  try {
    const messages = await MessagesDAO.getAll();
    res.render("chat", { messages, 
    style: "chat.css" });
  } catch (e) {
    console.log(`Cannot get messages`, e)
  }
})

export default router;

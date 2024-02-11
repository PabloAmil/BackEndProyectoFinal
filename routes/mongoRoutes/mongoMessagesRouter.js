import { Router } from "express";
import MessagesDAO from "../../src/dao/mongoDbManagers/messagesDbManager.js";

const router = Router();

router.get("/", async (req, res) => {
  const messages = await MessagesDAO.getAll();
  res.render("chat", { messages });
});

router.post("/", async (req, res) => {
  const { userMail, message } = req.body;

  await MessagesDAO.add(userMail, message);
  res.redirect("/api/messages");
});

export default router;

import { Router } from "express";
//import messagesDAO from "../../src/dao/mongoDbManagers/messagesDbManager.js"

const router = Router();

router.get("/", async (req, res) => {
  res.render("chat");
})

export default router;
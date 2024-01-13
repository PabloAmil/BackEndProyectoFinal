const express = require("express");
const router = express.Router();

let users = [];

router.get("/", (req, res)=> {
  res.status(200).send(users);
})

router.post("/", (req, res) => {
  let body = req.body;
  users.push(body);
  res.send("cart created");
})

module.exports = router;



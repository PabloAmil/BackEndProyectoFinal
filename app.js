const express = require("express");
const app = express();
const routerCarts = require("./routes/carts.router");
const routerProducts = require("./routes/products.router");

app.use(express.json());
app.use("/api/carts", routerCarts);
app.use("/api/products", routerProducts);


app.get("/", (req, res) => {
  res.status(200).send("coder house proyecto final - primera entrega");
})


app.listen(8080, () => console.log("now listening to port 8080"));



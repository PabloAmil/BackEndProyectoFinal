import express from "express";
import { engine } from 'express-handlebars';
import mongoose, { mongo } from "mongoose";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// import routerProducts from "./routes/products.router";
// import routerCarts from "./routes/carts.router";

import productsRouter from "./routes/mongoRoutes/mongoProductsRouter.js";
import cartsRouter from "./routes/mongoRoutes/mongoCartsRouter.js"

const app = express();

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname,'/views'));

app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// fs routes
// app.use("/api/products", routerProducts);
// app.use("/api/carts", routerCarts);


app.get("/", (req, res) => {
  res.render("home");
})

app.use((req, res, next)=> {
  res.render("404")
});

mongoose.connect("mongodb://localhost:27017/ecommerce");
app.listen(8080, () => console.log("now listening to port 8080"));


// 44.30 multer // dejar para el final // rutas


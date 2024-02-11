import express from "express";
import { engine } from 'express-handlebars';
import mongoose, { mongo } from "mongoose";
import path from 'path';
import { fileURLToPath } from 'url';
import { Server } from "socket.io";
import http from "http";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// import routerProducts from "./routes/products.router";
// import routerCarts from "./routes/carts.router";

import productsRouter from "./routes/mongoRoutes/mongoProductsRouter.js";
import cartsRouter from "./routes/mongoRoutes/mongoCartsRouter.js";
import chatRouter from "./routes/mongoRoutes/mongoMessagesRouter.js"


import messagesInDb from "./src/dao/mongoDbManagers/messagesDbManager.js";



const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname,'/views'));

app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/messages", chatRouter)

// fs routes
// app.use("/api/products", routerProducts);
// app.use("/api/carts", routerCarts);

app.get("/", (req, res) => {
  res.render("home");
})

app.use((req, res, next)=> {
  res.render("404")
});

io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('message', async (message) => {

    await messagesInDb.add(message);
    io.emit("message", message);
  })

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
})

mongoose.connect("mongodb://localhost:27017/ecommerce");
httpServer.listen(8080, () => console.log("now listening to port 8080"));





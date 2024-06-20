import express from "express";
import { engine } from 'express-handlebars';
import mongoose, { mongo } from "mongoose";
import path from 'path';
import { fileURLToPath } from 'url';
import { Server } from "socket.io";
import http from "http";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";
import session from 'express-session';
import initializePassport from "./src/dao/passport.config.js";
import passport from "passport";
import config from "./src/config/config.js";
import exphbs from 'express-handlebars';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// import routerProducts from "./routes/products.router";
// import routerCarts from "./routes/carts.router";

import productsRouter from "./routes/mongoRoutes/mongoProductsRouter.js";
import cartsRouter from "./routes/mongoRoutes/mongoCartsRouter.js";
import usersRouter from "./routes/mongoRoutes/usersRouter.js"
import chatRouter from "./routes/mongoRoutes/mongoMessagesRouter.js"
import sessionRouter from "./routes/mongoRoutes/mongoSessionsRouter.js"
import viewsRouter from "./routes/mongoRoutes/mongoViewsRouter.js"
import messagesInDb from "./src/dao/mongoDbManagers/messagesDbManager.js";
import productionLogger from "./utils/productionLogger.js";
import devLogger from "./utils/devLogger.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";
import handlebars from 'handlebars';
import paymentRouter from './routes/mongoRoutes/paymentRouter.js'


//const enviorment = config.devEnviorment;
const enviorment = config.prodEnviorment

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);
let logger;

const swaggerOptions = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Coder Final Project',
      description: 'Store oriented API'
    }
  },
  apis:[`${__dirname}/docs/**/*.yaml`]
}

const specs = swaggerJSDoc(swaggerOptions);
app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

app.engine('handlebars', engine({ 
  helpers: {
    eq: (a, b) => a === b
  }
}));

app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '/views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser("secret_cookie"));


handlebars.registerHelper('json', function(context) {
  return JSON.stringify(context);
});

if (enviorment === "development") {
  logger = devLogger;
} else {
  logger = productionLogger;
};

logger.info(`now using development: ${enviorment}`)

app.use(session({
  store: MongoStore.create({
    mongoUrl: config.local_mongo_url,
    //mongoUrl: config.atlas_mongo_url,
    ttl: 900,
  }),
  secret: config.session_secret, 
  resave: true,
  saveUninitialized: true
}))

initializePassport();
app.use(passport.initialize());
//app.use(passport.session());

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/messages", chatRouter);
app.use("/api/sessions", sessionRouter);
app.use("/api/users", usersRouter); 
app.use("/", viewsRouter);
app.use('/api/payments', paymentRouter)


app.get("/", (req, res) => {
  res.render("home", {
    style: "home.css"
  });
})

app.use((req, res, next) => {
  res.render("404", {
    style: "404.css"
  })
});

io.on('connection', (socket) => {
  logger.info('User connected');

  socket.on('message', async (data) => {
    await messagesInDb.add(data.userMail, data.message);
    io.emit("message", data);
  })
  socket.on('disconnect', () => {
    logger.info('User disconnected');
  });
})

export default logger;

mongoose.connect(config.local_mongo_url);
////mongoose.connect(config.atlas_mongo_url);
httpServer.listen(8080, () => logger.info("now listening to port 8080")); 





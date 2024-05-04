import dotenv from "dotenv";

dotenv.config();

export default {
  port: process.env.PORT,
  local_mongo_url: process.env.LOCAL_MONGO_URL,
  atlas_mongo_url: process.env.ATLAS_MONAGO_URL,
  session_secret: process.env.SESSION_SECRET,
  jwt_secret: process.env.JWT_SECRET,
  client_Id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
  callback_url: process.env.CALLBACK_URL,
  devEnviorment: process.env.DEV,
  prodEnviorment: process.env.PROD,
  gmailUSer: process.env.GUSER,
  gmailPass: process.env.GPASS,
}



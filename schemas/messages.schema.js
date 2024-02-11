import mongoose from "mongoose";

const messagesSchema = new mongoose.Schema({

  userMail: String, 
  message: String,

});

export default mongoose.model('messages', messagesSchema);



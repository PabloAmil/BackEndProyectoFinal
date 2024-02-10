import mongoose from "mongoose";

const messagesSchema = new mongoose.Schema({

  user: String, 
  message: String,
  required: true,

});

export default mongoose.model('messages', messagesSchema);



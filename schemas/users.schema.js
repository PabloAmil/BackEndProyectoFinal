import mongoose from "mongoose";

const UsersSchema = new mongoose.Schema({
  first_name: {
    type: String,
  },

  last_name: {
    type: String,
  },

  age: {
    type: Number,
  },

  email: {
    type: String
  },
  
  password: {
    type: String
  },

  role: {
    type: String,
    default: "User"
  }
});

export default mongoose.model("Users", UsersSchema);


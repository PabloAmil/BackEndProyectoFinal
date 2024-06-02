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
  },

  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'carts' 
  },

  documents: {
    type: [
      {
        name: { 
          type: String, 
        },
        reference: {
          type: String
        }
      }
    ],
    default: []
  },

  last_conection: {
    type: String,
    default: '00:00'
  }
});

export default mongoose.model("Users", UsersSchema);


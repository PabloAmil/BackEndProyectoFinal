import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  content: Array
});

export default mongoose.model('carts', cartSchema);
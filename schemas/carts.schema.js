import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  content: {
    type: [
      {
        product: { 
          type: mongoose.Schema.Types.ObjectId, 
          ref: 'products' 
        }
      }
    ],
    default: []
  }
});

export default mongoose.model('carts', cartSchema);


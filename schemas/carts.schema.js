import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

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

cartSchema.plugin(mongoosePaginate);
export default mongoose.model('carts', cartSchema);


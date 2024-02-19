import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  content: { // content comienza como objeto pero lo define como un array en type
    type: [ //  a su vez, ese array va a ser un array de objetos
      {
        product: { // product es una key de cada objeto, la cual va a tener el valor asociado que va a ser de tipo ObjectId
          type: mongoose.Schema.Types.ObjectId, 
          ref: 'products' // y hace referencia a la coleccion de products
        }
      }

    ],
    default: []
  }
});

export default mongoose.model('carts', cartSchema);


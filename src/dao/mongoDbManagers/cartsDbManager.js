import Carts from "../../../schemas/carts.schema.js";
import productsModel from "../../../schemas/products.schema.js";

class cartsDAO {
  static async getAll() {
    try {
      return Carts.find().lean();
    } catch (e) {
      console.log(`could not get carts`);
    }
  }

  static async getCartById(id) {
    try {
      return Carts.findOne({ _id: id }).lean().populate('content.product');
    } catch (e) {
      console.log(`cart ${id} cannot be found`);
    }
  }

  static async createNewCart(content = []) {
    try {
      return new Carts({ content }).save();
    } catch (e) {
      console.log(`cart creation failed`);
    }
  }

  static async updateCart(id, data) {

    try {
      let updatedCart = await Carts.findOneAndUpdate({ _id: id }, data, { new: true });
      updatedCart = await updatedCart.populate('content')
      return updatedCart;

    } catch (e) {
      console.log(`cart update failed, cart id: ${id}`);
      console.log(e)
    }
  }

  static async paginate(filter, options) {
    try {
      return Carts.paginate(filter, options);
    } catch (e) {
      console.log('Carts not found', e);
    }
  }

  static async displayCartItems(id) {
    try {
      const cart = await Carts.findOne({ _id: id }).populate({
        path: 'content.product',
        model: 'products'
      });

      if (!cart) {
        throw new Error('Cart not found');
      }

      if (cart.content.length === 0) {
        return "Cart is empty";
      }

      return cart.content.map(item => {
        return {
          productId: item.product._id,
          productName: item.product.title,
          productPrice: item.product.price,
          stock: item.product.stock,
          quantity: item.product.quantity
        };
      });
    } catch (error) {
      console.error('Error obtaining cart content:', error.message);
      throw error;
    }
  }

  static async findProductIndexById(productId, cart) {
    const productIndex = cart.content.findIndex(item => {
      return item.product._id.toString() === productId;
    });
    return productIndex;
  };


  static async emptyCart(cartId) {

    const cart = await cartsDAO.getCartById(cartId);
    cart.content = [];
    let result = await cartsDAO.updateCart(cartId, cart);
    return result;
  }
};

export default cartsDAO;
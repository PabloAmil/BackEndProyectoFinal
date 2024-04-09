import Carts from "../../../schemas/carts.schema.js";

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
      return new Carts({content}).save();
    } catch (e) {
      console.log(`cart creation failed`);
    }
  }

  static async updateCart(id, data) {
    try {
      return Carts.findOneAndUpdate({ _id: id }, data).populate('content.product');
    } catch (e) {
      console.log(`cart update failed, cart id: ${id}`);
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
          
        };
      });
    } catch (error) {
      console.error('Error obtaining cart content:', error.message);
      throw error; 
    }
  }
  
  
}

export default cartsDAO;
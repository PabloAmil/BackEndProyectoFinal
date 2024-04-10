import ticketModel from "../../../schemas/tickets.schema.js";
import cartsDAO from "./cartsDbManager.js";
import ProductsDAO from "./productsDbManager.js";

class ticketsDAO {

  static async generateCode(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return code;
  }

  static async getDatetime() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minutes = date.getMinutes();

    const dateTime = `${day}/${month}/${year} - ${hour}:${minutes}`;
    return dateTime;
  }


  static async checkStock(cart_data) {

    let cartId = cart_data.toString();
    let cart = await cartsDAO.getCartById(cartId);
    let products = await ProductsDAO.getAll();
    const Ids = {};
    const withStock = [];
    const backToCart = [];

    cart.content.forEach(product => {
      const productID = product.product._id;
      Ids[productID] = (Ids[productID] || 0) + 1;
    });

    for (let product in products) {

      if (products[product].stock >= Ids[products[product]._id]) {

        withStock.push(products[product].price * Ids[products[product]._id]);

        let stock = products[product].stock - Ids[products[product]._id];
        let oldProduct = await ProductsDAO.getById(products[product]._id);
        let updatedProduct = await ProductsDAO.update(products[product]._id.toString(), {...oldProduct, stock});

      } else {
        for (let i = 0; i < Ids[products[product]._id]; i++) {
          backToCart.push({product: products[product]._id} ) 
        }
      }
    } 

    cart = await cartsDAO.emptyCart(cartId);

    for (let i = 0; i < backToCart.length; i++) {
      cart.content.push(backToCart[i]);
    }
    cart = await cartsDAO.updateCart(cartId, cart);
    return await this.getAmount(withStock);
  }

  static async getAmount(prices) {
    let total = prices.reduce((acc, val) => acc + val, 0);
    return total;
  };

  static async createTicket(user) {
    try {
      return new ticketModel({ code: await ticketsDAO.generateCode(25), purchase_datetime: await ticketsDAO.getDatetime(), amount: await ticketsDAO.checkStock(user.cart), purchaser: user.email }).save();
    } catch (e) {
      console.log(`something went wrong with your purchase` + e);
    }
  }
};

export default ticketsDAO;
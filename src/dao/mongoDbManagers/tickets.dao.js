import ticketModel from "../../../schemas/tickets.schema.js";
import cartService from "../../repositories/cartsRepository.js";
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

    let cartId = cart_data;
    let cart = await cartService.getCartById(cartId);
    const Ids = {};
    const withStock = [];
    const backToCart = [];

    cart.content.forEach(product => {
      const productID = product._id;
      Ids[productID] = (Ids[productID] || 0) + 1;
    });

    for (let product in Ids) {
      let productToReview = await ProductsDAO.getById(product);

      if (productToReview.stock > Ids[product]) {
        withStock.push(productToReview.price * Ids[product]);
        let newStock = (productToReview.stock - Ids[product]);
        productToReview.stock = newStock;
        let updatedProduct = await ProductsDAO.update(product, productToReview);

      } else {
        for (let i = 0; i < Ids[product]; i++) {
          backToCart.push(product)
        }
      }
    }
    let oldCart = await cartService.clearClart(cartId);
    for (let i = 0; i < backToCart.length; i++) {
      oldCart.content.push(Object(backToCart[i]));
    }
    const updatedCart = await cartService.update(cartId, oldCart);
    return await this.getAmount(withStock);
  };


  static async getAmount(prices) {
    let total = prices.reduce((acc, val) => acc + val, 0);
    return total;
  };


  static async createTicket(user) {
    try {
      return await new ticketModel({ code: await ticketsDAO.generateCode(25), purchase_datetime: await ticketsDAO.getDatetime(), amount: await ticketsDAO.checkStock(user.cart), purchaser: user._id }).save();
    } catch (e) {
      console.log(`something went wrong with your purchase ` + e);
    }
  }
};

export default ticketsDAO;
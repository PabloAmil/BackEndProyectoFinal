import cartsDAO from "../dao/mongoDbManagers/cartsDbManager.js";

class CartsRepository {

  constructor(DAO) {
    this.DAO = DAO; 
  }

  getAllCarts = async () => {
    let result = await this.DAO.getAll();
    return result;
  }

  getCartById = async (cartId) => {
    let result = await this.DAO.getCartById(cartId);
    return result;
  }

  create = async () => {
    let result = await this.DAO.createNewCart();
    return result;
  }

  update = async (cartId, data) => {
    let result = await this.DAO.updateCart(cartId, data);
    return result;
  }

  displayItemsInCart = async (cartId) => {
    let result = await this.DAO.displayCartItems(cartId);
    return result;
  }

  findProductIndexInCart = async (productId, cart) => {
    let result = await this.DAO.findProductIndexById(productId, cart);
    return result;
  }

  clearClart = async (cartId) => {
    let result = await this.DAO.emptyCart(cartId);
    return result;
  }
}

const cartService = new CartsRepository(cartsDAO);
export default cartService;
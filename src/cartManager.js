const productManager = require("../src/productManager");
const fs = require('fs');
const path = require('path');

let carts = [];
let id = 0;

const getCartProducts = async (cartId) => {

  // getCartsFromDataBase()

  cartId = JSON.parse(cartId);
  let cart = carts.find((cart) => cart.id === cartId);
  if (cart) {
    return cart.products;
  } else {
    return false;
  }
}

class CartCreator {

  constructor(id) {
    this.id = id;
  }
  products = [];

  addProductToCart = async (productId) => {

    try {
      let product = await productManager.getProductsById(productId);
      if (!product) {
        return false;
      }
      let id = product.id;
      let productIndex = this.products.findIndex((product) => product.product === id);

      if (productIndex !== -1) {
        this.products[productIndex].quantity++;
        return true;
      } else {
        this.products.push({
          product: id,
          quantity: 1
        })
        return true;
      }
    } catch (e) {
      console.log(e);
    }
  }
}

const findCart = async (id, productId) => {

  // getCartsFromDataBase()

  id = JSON.parse(id);
  productId = JSON.parse(productId);

  let cart = carts.find((cart) => cart.id === id);

  if (cart) { 

    let productAlsoExists = await cart.addProductToCart(productId);
    if (productAlsoExists) {
      
      await saveCartsInDataBase(carts);
      return true;
    }
  } else {
    return false;
  }
}


// const getCartsFromDataBase = () => {

// }

const saveCartsInDataBase = async (carts) => {

  try {
    await fs.promises.writeFile(path.join(__dirname, 'carts.txt'), JSON.stringify(carts));
  } catch (e) {
    console.log(e)
  }
}

module.exports = {
  CartCreator,
  carts,
  id,
  getCartProducts,
  findCart,
  saveCartsInDataBase
}


const productManager = require("../src/productManager");
const fs = require('fs');
const path = require('path');

let carts = [];
let id = 0;

const getCartProducts = async (cartId) => {

  // estos funcionan
  // let oldCarts = await getCartsFromDataBase();
  // console.log(oldCarts);

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
}

const addxProductToxCart = async (cartId, productId) => {

  let prodId = JSON.parse(productId)
  let cart = await getCartById(cartId);
  let product = await productManager.getProductsById(prodId)

  if (cart !== false && product !== false) {

    let productAlreadyExists = checkIfProductExistsInCart(cart, product.id);
    let save = await saveCartsInDataBase(carts);
    return true;
  } else {
    return false;
  }
}

const checkIfProductExistsInCart = (cart, prodId) => {

  let productIndex = cart.products.findIndex((product) => product.product === prodId);
  if (productIndex === -1) {
    cart.products.push({
      product: prodId,
      quantity: 1
    })
  } else {
    cart.products[productIndex].quantity++;
  }
}

const getCartById = async (id) => {

  // getCartsFromDataBase()
  id = JSON.parse(id);
  let cart = carts.find((cart) => cart.id === id);

  if (cart) {
    return cart;
  } else {
    return false;
  }
}

const getCartsFromDataBase = async () => {
  try {
    
    let storedCarts = await fs.promises.readFile(path.join(__dirname, 'carts.txt'));
    return JSON.parse(storedCarts);
  }catch (e) {
    console.log(e);
  }
}

const saveCartsInDataBase = async (carts) => {

  try {
    await fs.promises.writeFile(path.join(__dirname, 'carts.txt'), JSON.stringify(carts));
  } catch (e) {
    console.log(e);
  }
}

module.exports = {
  id,
  carts,
  CartCreator,
  getCartProducts,
  saveCartsInDataBase,
  addxProductToxCart
}

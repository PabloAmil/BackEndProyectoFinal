const productManager = require("../src/productManager");
const fs = require('fs');
const path = require('path');

let id = 0;
let carts = [];

const getCartProducts = async (cartId) => {

  let oldCarts = await getCartsFromDataBase();
  carts = oldCarts;

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

const createAndAddNewCart = async () => {
  const newCart = new CartCreator(id);
  
  let oldCarts = await getCartsFromDataBase();
  carts = oldCarts;

  let idExists = carts.find((cart) => cart.id === id) ;
  if (idExists) {
    const maxId = Math.max(...carts.map(cart => cart.id));
    newCart.id = maxId + 1;
    carts.push(newCart);
  } else {
    carts.push(newCart);
    id = id + 1;
  }
  await saveCartsInDataBase(carts);
  return carts;
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

const checkIfProductExistsInCart = async (cart, prodId) => {

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

  let oldCarts = await getCartsFromDataBase();
  carts = oldCarts;
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
    let storedCarts = await fs.promises.readFile(path.join(__dirname, 'carts.json'), 'utf-8');
    if (!storedCarts) {
      return [];
    }
    return JSON.parse(storedCarts);
  } catch (e) {
    console.log(e);
    return [];
  }
}

const saveCartsInDataBase = async (carts) => {

  try {
    await fs.promises.writeFile(path.join(__dirname, 'carts.json'), JSON.stringify(carts));
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
  addxProductToxCart,
  createAndAddNewCart,
  getCartsFromDataBase
}

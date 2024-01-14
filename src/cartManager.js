const productManager = require("../src/productManager");

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

  constructor(id){
    this.id = id;
  }
  products = [];
  addProductToCart = async (productId) => {

    let  { id } = await productManager.getProductsById(productId);

    // crear metodo para agregar de a 1


    this.products.push({
      product: id,
      quantity: 1
    })

    console.log(this.products)


    //saveCartsInDataBase();
  }

}

const findCart = (id, productId) => {

  // getCartsFromDataBase()

  id = JSON.parse(id);
  productId = JSON.parse(productId);

  let cart = carts.find((cart) => cart.id === id);
  cart.addProductToCart(productId);
}



// const getCartsFromDataBase = () => {

// }

// const saveCartsInDataBase = () => {

// }

module.exports = {
  CartCreator,
  carts,
  id,
  getCartProducts,
  findCart
}



// tiene que buscar el cart, buscar el producto con ese id, extraerlo y guardarlo en un nuevo objeto dentro de ese cart
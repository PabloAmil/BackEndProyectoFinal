const express = require("express");
const router = express.Router();
const CartManager = require("../src/cartManager");

router.get("/", (req, res)=> {
  res.status(200).send('hola');
})

router.get("/:cid", async (req, res) => {

  let cid = req.params.cid;
  let productsInCart =  await CartManager.getCartProducts(cid);

  if (productsInCart) {
    res.status(200).send(productsInCart)
  } else {
    res.status(400).send('Carrito inexistente');
  }
})


router.post("/", (req, res) => {

  const newCart = new CartManager.CartCreator(CartManager.id);
  CartManager.carts.push(newCart);
  CartManager.id = CartManager.id + 1;
  // guardar carts en base de datos
  res.send(CartManager.carts);
})

router.post("/:cid/products/:pid", (req, res) => {

  const cartId = req.params.cid;
  const productId = req.params.pid;

  CartManager.findCart(cartId, productId); // encuentra el cart

  res.send({cartId, productId})
})


module.exports = router;



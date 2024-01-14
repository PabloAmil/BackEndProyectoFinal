const express = require("express");
const router = express.Router();
const CartManager = require("../src/cartManager");

router.get("/", (req, res)=> {
  res.status(200).send(CartManager.carts);
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

router.post("/", async (req, res) => {

  const newCart = new CartManager.CartCreator(CartManager.id);
  CartManager.carts.push(newCart);
  CartManager.id = CartManager.id + 1;
  await CartManager.saveCartsInDataBase(CartManager.carts);
  res.send(CartManager.carts);
})

router.post("/:cid/products/:pid", async (req, res) => {

  const cartId = req.params.cid;
  const productId = req.params.pid;
  CartManager.findCart(cartId, productId); 
  res.send(`product with id ${productId} added to cart ${cartId}`)
})


module.exports = router;



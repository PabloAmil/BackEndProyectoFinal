const express = require("express");
const router = express.Router();
const CartManager = require("../src/cartManager");

router.get("/", (req, res) => {
  res.status(200).send(CartManager.carts);
})

router.get("/:cid", async (req, res) => {

  let cid = req.params.cid;
  try {
    let productsInCart = await CartManager.getCartProducts(cid);
    if (productsInCart) {
      res.status(200).send(productsInCart);
    } else {
      res.status(400).send('Cart not found');
    }
  } catch (e) {
    console.log(e);
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

  const cartId = req.params.cid; // a un determinado cart
  const productId = req.params.pid; // agregarle un determinado producto

  let addProduct = await CartManager.addxProductToxCart(cartId, productId);

  if (addProduct) {
    res.status(200).send(CartManager.carts);
  } else {
    res.status(400).send('operation failed');
  }
})


module.exports = router;



const express = require("express");
const router = express.Router();
const CartManager = require("../src/cartManager");

async function startApp() {
  await cartManager.main();
}

router.get("/", async (req, res) => {
  let storedCarts = await CartManager.getCartsFromDataBase()
  res.status(200).send(storedCarts); 
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

  let cartsCreated = await CartManager.createAndAddNewCart();
  res.send(cartsCreated);
})

router.post("/:cid/products/:pid", async (req, res) => {

  const cartId = req.params.cid; 
  const productId = req.params.pid; 

  let addProduct = await CartManager.addxProductToxCart(cartId, productId);

  if (addProduct) {
    res.status(200).send(CartManager.carts);
  } else {
    res.status(400).send('operation failed');
  }
})


module.exports = router;



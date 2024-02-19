import { Router } from "express";
import CartsDAO from "../../src/dao/mongoDbManagers/cartsDbManager.js";

const router = Router();

router.get('/', async (req, res) => {
  let carts = await CartsDAO.getAll();
  res.render('carts', carts);
})

router.get('/new', async (req, res) => {
  await CartsDAO.createNewCart();
  res.render('newCart');
})

router.get("/:id", async (req, res) => {

  let id = req.params.id;
  if (!id) {
    res.redirect("carts");
  }
  let cart = await CartsDAO.getCartById(id);
  if (!cart) {
    res.render("404");
  }
  console.log(cart)
  res.render("cart", {
    cart
  })
})

router.put("/:id", async (req, res) => {

  let id = req.params.id;
  let newCartContent = req.body;

  if (!id) {
    res.status(404).send({
      status: 400,
      result: "error",
      error: "cart not found"
    });
  }

  try {
    let cart = await CartsDAO.updateCart(id, newCartContent);
    res.status(200).send({
      status: 200,
      result: "Succes",
      payload: cart
    })
  } catch (e) {
    console.log(`Failed to update Cart`);
    res.status(500).send({
      status: 500,
      result: "Error",
      error: "Error updating Cart"
    })
  }
})


// add product to cart
router.post("/:cartId/addProduct/:productId", async (req, res) => {

  let cartId = req.params.cartId;
  let productId = req.params.productId;

  try {
    let cart = await CartsDAO.getCartById(cartId);
    cart.content.push({ product: productId });
    let result = await CartsDAO.updateCart(cartId, cart);

    res.status(200).send({
      status: 200,
      result: "Succes",
      payload: result
    })

  } catch (e) {
    res.status(500).send({
      status: 500,
      result: "Error",
      error: "Could not add product to cart"
    })
  }
})

// clear all products in cart
router.delete("/:cartId", async (req, res) => {

  let cartId = req.params.cartId;

  try {
    let cart = await CartsDAO.getCartById(cartId);
    cart.content = [];
    let result = await CartsDAO.updateCart(cartId, cart);

    res.status(200).send({
      status: 200,
      result: "Cart emptied successfully.",
      payload: result
    })

  } catch (e) {
    res.status(500).send({
      status: 500,
      result: "Error",
      error: "Unable to empty the cart."
    })
  }
})


// delete 1 product from cart 

router.delete("/:cartId/products/:productId", async (req, res) => {
  let cartId = req.params.cartId;
  let productId = req.params.productId;

  try {
    let result = await CartsDAO.updateCart(cartId, { $pull: { "content": { product: productId } } }, { new: true });

    res.status(200).send({
      status: 200,
      result: "product deleted successfully.",
      payload: result // revisar esto
    })

  } catch (error) {
    res.status(500).send({
      status: 500,
      result: "Error",
      error: "Unable to delete the product."
    })
  }
})
export default router;


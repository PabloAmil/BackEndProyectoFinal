import { Router } from "express";
import CartsDAO from "../../src/dao/mongoDbManagers/cartsDbManager.js";
import ticketsDAO from "../../src/dao/mongoDbManagers/tickets.dao.js";
import passport from "passport";
import checkPermissions from "../../utils/auth.middleware.js";
import cartService from "../../src/repositories/cartsRepository.js";
import ProductsDAO from "../../src/dao/mongoDbManagers/productsDbManager.js";

const router = Router();

router.get('/', async (req, res) => {

  let carts = await cartService.getAllCarts();
  res.status(200).send(carts);
})

router.get('/new', passport.authenticate("jwt", { session: false }),  checkPermissions('Admin'), async (req, res) => { // revisar

  let dummyCart = await cartService.create()
  res.status(200).send(dummyCart);
})

router.get("/:id", async (req, res) => {

  let id = req.params.id;

  if (!id) {
    res.redirect("carts");
  }
  let cart = await cartService.getCartById(id)
  if (!cart) {
    res.render("404");
  }

  //res.send(cart)

  res.render("cart", {
    cart,
    style: 'cart.css'
  })
})


// update cart
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

    let cart = await cartService.update(id, newCartContent);
    let paginatedCart = await CartsDAO.paginate({}, { page: 1, limit: 10, lean: true });

    paginatedCart.prevLink = paginatedCart.hasPrevPage ? `http://localhost:8080/api/carts/${id}/page=${paginatedCart.prevPage}` : '';
    paginatedCart.nextLink = paginatedCart.hasNextPage ? `http://localhost:8080/api/carts/${id}/page=${paginatedCart.nextPage}` : '';


    res.status(200).send({
      status: 200,
      result: "Succes",
      payload: paginatedCart
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

// update only 1 property from body
router.put("/:cartId/products/:productId", async (req, res) => {

  let cartId = req.params.cartId;
  let productId = req.params.productId;
  let data = req.body

  if (!cartId) {
    res.status(404).send({
      status: 400,
      result: "error",
      error: "cart not found"
    });
  }

  try {

    let cart = await cartService.getCartById(cartId);
    const productIndex = cart.content.findIndex(object => object.product._id.toString() === String(productId));
    let oldProduct = cart.content[productIndex].product;
    let updatedProduct = { ...oldProduct, ...data }
    cart.content[productIndex].product = updatedProduct;

    await cartService.update(cartId, { content: cart.content });

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
});


// add product to cart
router.post("/:cartId/addProduct/:productId", passport.authenticate("jwt", { session: false }), checkPermissions("User"), async (req, res) => {

  let cartId = req.params.cartId;
  let productId = req.params.productId;

  try {
    let cart = await cartService.getCartById(cartId);
    let product = await ProductsDAO.getById(productId);

    if (!req.user) {
      return res.status(401)
    }

    if (product.owner !== req.user.email) {

      cart.content.push({ product: productId });
      let result = await cartService.update(cartId, cart);
  
      res.status(200).send({
        status: 200,
        result: "Success",
        payload: result
      })
    } else {
      res.status(401).send(`You cannot add your own product to your cart`);
    }
  
  } catch (e) {
    res.status(500).send({
      status: 500,
      result: "Error",
      error: "Could not add product to cart"
    })
  }
})

// clear cart
router.delete("/:cartId", async (req, res) => {

  let cartId = req.params.cartId;

  try {
    let result = await cartService.clearClart(cartId);
    res.status(200).send({
      status: 200,
      result: "Cart deleted successfully.",
      payload: result
    });
  } catch (e) {
    res.status(500).send({
      status: 500,
      result: "Error",
      error: "Unable to delete the cart."
    });
  }
});

// delete 1 product from cart 

router.delete("/:cartId/products/:productId", async (req, res) => {
  let cartId = req.params.cartId;
  let productId = req.params.productId;

  try {
    let result = await cartService.update(cartId, { $pull: { "content": { product: productId } } }, { new: true });
  
    res.status(200).send({
      status: 200,
      result: "product deleted successfully.",
    });

  } catch (error) {
    res.status(500).send({
      status: 500,
      result: "Error",
      error: "Unable to delete the product."
    });
  }
});

router.get("/:cartId/purchase", passport.authenticate("jwt", { session: false }), checkPermissions("User"), async (req, res) => {

  let ticket = await ticketsDAO.createTicket(req.user);
  res.send(ticket);
})

export default router;


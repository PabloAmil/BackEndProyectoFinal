import { Router } from "express";
import CartsDAO from "../../src/dao/mongoDbManagers/cartsDbManager.js";
import ticketsDAO from "../../src/dao/mongoDbManagers/tickets.dao.js";
import passport from "passport";
import checkPermissions from "../../utils/auth.middleware.js";
import cartService from "../../src/repositories/cartsRepository.js";
import ProductsDAO from "../../src/dao/mongoDbManagers/productsDbManager.js";
import axios from 'axios';
import Stripe from 'stripe';
import config from "../../src/config/config.js";

const router = Router();
const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);

router.get('/', async (req, res) => {

  try {
    let carts = await cartService.getAllCarts();
    res.status(200).send(carts);
    
  } catch (error) {
    res.status(500).send('Could not get Carts');
  }
})

router.get('/new', passport.authenticate("jwt", { session: false }), checkPermissions('Admin'), async (req, res) => { 

  try {
    let dummyCart = await cartService.create()
    res.status(200).send(dummyCart);
    
  } catch (error) {
    res.status(500).send("Failed to create Dummy Cart");
  }
})

router.get("/:id", async (req, res) => {
  try {
    const cartId = req.params.id;
    const cartContent = [];

    if (!cartId) {
      res.redirect("carts");
    }
    let cart = await cartService.getCartById(cartId);
    if (!cart) {
      res.render("404");
    }

    for (let product of cart.content) {
      let prod = await ProductsDAO.getById(product._id);
      cartContent.push(prod);
    }

    let serverUrl = config.serverUrl;

    res.render("cart", {
      serverUrl,
      cartId,
      cartContent,
      style: 'cart.css'
    });
    
  } catch (error) {
    res.status(500).send('Could not retrieve Cart');
  }
});



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

    paginatedCart.prevLink = paginatedCart.hasPrevPage ? `${config.serverUrl}/api/carts/${id}/page=${paginatedCart.prevPage}` : '';
    paginatedCart.nextLink = paginatedCart.hasNextPage ? `${config.serverUrl}/api/carts/${id}/page=${paginatedCart.nextPage}` : '';


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
router.post("/:cartId/addProduct/:productId", passport.authenticate("jwt", { session: false }), checkPermissions('User'), async (req, res) => {

  if (!req.user) {
    return res.status(401)
  }

  let cartId = req.params.cartId;
  let productId = req.params.productId;

  try {
    let cart = await cartService.getCartById(cartId);
    let product = await ProductsDAO.getById(productId);

    if (product.owner !== req.user.email) {

      cart.content.push(product);
      let result = await cartService.update(cartId, cart);
      
      res.status(200).json({
        status: 200,
        result: "Success",
        payload: result,
        redirectUrl: `${config.serverUrl}/api/products`
      });
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
    let cart = await cartService.getCartById(cartId);
    let newContent = [];

    for (let product of cart.content) {
      let productStringId = product._id.toString();
      if (productStringId !== productId) {
        newContent.push(product);
      }
    }

    cart.content = newContent;
    let newCart = await cartService.update(cartId, cart);
    let newCartId = JSON.stringify(newCart._id);

    res.status(200).send('product deleted');

  } catch (error) {
    res.status(500).send({
      status: 500,
      result: "Error",
      error: "Unable to delete the product."
    });
  }
});

// purchase products
router.get("/:cartId/purchase", passport.authenticate("jwt", { session: false }), checkPermissions("User"), async (req, res) => {

  try {
    const user = req.user;
    const ticket = await ticketsDAO.createTicket(user);
    const postData = {
      userData: user,
      ticket: ticket
    }

    const response = await axios.post(`${config.serverUrl}/api/payments/create-payment-intent`, postData, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const clientSecret = response.data.clientSecret;

    res.redirect(`${config.serverUrl}/api/payments/checkout?clientSecret=${clientSecret}`);

  } catch (error) {
    res.status(500).send({
      message: 'Error in POST request',
      error: error.message
    })
  }
});

export default router;


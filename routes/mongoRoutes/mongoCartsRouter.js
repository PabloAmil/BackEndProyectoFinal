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

  res.render("cart", {
    content: cart.content
  })
})

router.put("/:id", async (req, res)=> {

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

export default router;


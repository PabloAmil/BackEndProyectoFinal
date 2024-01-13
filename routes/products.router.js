const express = require("express");
const router = express.Router();
const productManager = require("../src/productManager");


router.get("/", async (req, res)=> {
  
  if (req.query.limit) {
    let { limit } = req.query;
    let products = await productManager.showXnumberOfProducts(limit);
    res.status(200).send(products);
  } else {
    let products = await productManager.getProducts();
    res.status(200).send(products);
  }
})

router.get("/:pid", async (req, res)=> {

  let id = parseInt(req.params.pid);
  let product = await productManager.getProductsById(id);
  if (product !== false) {
    res.send(product);
  } else {
    res.status(404).send('Error 404: Product not found');
  }
})


router.post("/", async (req, res) => {
  
  let body = req.body;
  let newProduct = await productManager.createNewProduct(body);
  if (newProduct) {
    res.status(200).send('new product created');
  } else {
    res.status(401).send('product creation failed');
  }
})

router.put("/:pid", async (req, res) => {

  let id = parseInt(req.params.pid);
  let body = req.body;
  let updateRequest = await productManager.updateProducts(id, body);
  if (updateRequest) {
    res.status(200).send('modification success');
  } else {
    res.status(404).send('Cannot modify product id');
  }
})

router.delete('/:pid', async (req, res) => {

  let id = parseInt(req.params.pid);
  let deleteAction = productManager.deleteProduct(id);
  if (deleteAction) {
    res.status(200).send("Product deleted from database");
  } else {
    res.status(404).send("Could not delete product");
  }
})

module.exports = router;












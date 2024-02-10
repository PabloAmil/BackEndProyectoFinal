import { Router } from "express";
import ProductsDAO from "../../src/dao/mongoDbManagers/productsDbManager.js";
import upload from "../../utils/upload.middlewares.js";

const router = Router();


router.get("/", async (req, res) => {
  let withStock = req.query.stock;

  let products;

  if (withStock === undefined) {
    products = await ProductsDAO.getAll();
  } else {
    products = await ProductsDAO.getAllWithStock();
  }

  res.render("products", { products });
})

router.get("/new", (req, res) => {
  res.render("new-product");
})

router.get("/:id", async (req, res) => {

  let id = req.params.id;
  if (!id) {
    res.redirect("/products");
  }
  let product = await ProductsDAO.getById(id);
  if (!product) {
    res.render("404");
  }
  res.render('product', {
    title: product.title,
    description: product.description,
    price: product.price,
    photo: product.photo,
    isStock: product.stock > 0
  });
})

router.post("/", upload.single('image'), async (req, res)=>{
  let filename = req.file.filename;
  let product = req.body; 

  await ProductsDAO.add( filename, product.title, product.description, product.code, product.price, product.status, product.stock, product.category);
  res.redirect("/products");
})

export default router;


// seguir 57.40 
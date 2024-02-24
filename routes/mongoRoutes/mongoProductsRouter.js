import { Router, query } from "express";
import ProductsDAO from "../../src/dao/mongoDbManagers/productsDbManager.js";
import upload from "../../utils/upload.middlewares.js";
import mongoose from "mongoose";

const router = Router();


// get products
router.get("/", async (req, res) => {

  let page = parseInt(req.query.page);
  if (!page) {
    page = 1;
  }
  let limit = parseInt(req.query.limit);
  if (!limit) {
    limit = 10;
  }

  let sort = req.query.sort;
  if (!sort) {
    sort = -1;
  } else {
    if (sort === "asc") {
      sort = 1;
    } else if (sort === "desc") {
      sort = -1;
    } else {
      sort = 1;
    }
  }

  let filter = {}
  let category = req.query.category;

  if (category) {
    filter.category = category
  }

  let stock = req.query.stock;
  if (stock) {
    filter.stock = stock;
  }

  try {

    let user;
    let userLastName;
    let role;

    if (req.session.user) {
      user = req.session.user;
      userLastName = req.session.last_name;
    }

    if (req.session.role === "Admin") {
      role = req.session.role;
    }
    role = role.toUpperCase();

    let products = await ProductsDAO.paginate(filter, { page, limit, lean: true, sort: { price: sort } })

    products.prevLink = products.hasPrevPage ? `http://localhost:8080/api/products/page=${products.prevPage}` : '';
    products.nextLink = products.hasNextPage ? `http://localhost:8080/api/products/page=${products.nextPage}` : '';

    res.render("products", {
      style: 'products.css',
      products,
      user,
      userLastName,
      role
    });

  } catch (error) {
    console.log(`Failed to get products`);
    res.status(500).send({
      status: 500,
      result: "Error",
      error: "Error getting products"
    })
  }
})

// create product
router.get("/new", (req, res) => {
  res.render("new-product", {
    style: 'new-product.css',
  });
})

// get product by id
router.get("/:id", async (req, res) => {

  let id = req.params.id;
  if (!id) {
    res.redirect("/");
  }
  let product = await ProductsDAO.getById(id);
  if (!product) {
    res.render('404', {
      style: "404.css"
    }
    );
  }
  res.render('product', {
    title: product.title,
    description: product.description,
    price: product.price,
    photo: product.photo,
    category: product.category,
    isStock: product.stock > 0,
    style: 'product.css'
  });
})

router.post("/", upload.single('image'), async (req, res) => {
  let filename = req.file.filename;
  let product = req.body;

  await ProductsDAO.add(product.title, product.description, product.code, product.price, product.status, product.stock, product.category, filename);
  res.redirect("/");
})

// delete product
router.delete("/delete/:id", async (req, res) => {
  try {
    let id = req.params.id;
    if (!id) {
      return res.render("products", {
        style: 'product.css'
      });
    }
    await ProductsDAO.remove(id);
    res.json({ success: true, message: 'Product deletion success' });
  } catch (e) {
    console.error('Error while trying to delete product:', e);
    res.status(500).json({ success: false, message: 'Error while trying to delete product' });
  }
})


// update product
router.get("/product-edit/:id", async (req, res) => {

  let id = req.params?.id;

  console.log(id);

  if (!id) {
    res.redirect("/");
  }
  let product = await ProductsDAO.getById(id);
  if (!product) {
    res.render("404", {
      style: "404.css"
    });
  }
  res.render('productUpdate', {
    title: product.title,
    description: product.description,
    price: product.price,
    photo: product.photo,
    isStock: product.stock > 0,
    id: product._id,
    style: 'product-update.css'
  });
})


router.post("/admin-update/:id", upload.single('image'), async (req, res) => {

  let filename = req.file.filename;
  let product = req.body;
  let id = req.params.id;

  let data = {
    ...product, filename
  };
  try {
    if (!id) {
      return res.render("products", {
        style: 'product.css'
      }
      );
    }

    await ProductsDAO.update(id, data);
    res.json({ success: true, message: 'Product update success' });
  } catch (e) {
    console.error('Error while trying to delete product:', e);
    res.status(500).json({ success: false, message: 'Error while trying to update product' });
  }
})

export default router;

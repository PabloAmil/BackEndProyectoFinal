import { Router, query } from "express";
import ProductsDAO from "../../src/dao/mongoDbManagers/productsDbManager.js";
import upload from "../../utils/upload.middlewares.js";
import passport from "passport";
import checkPermissions from "../../utils/auth.middleware.js";
import logger from "../../app.js";

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
    let role = '';

    if (req.user) {
      user = req.user.first_name;
      userLastName = req.user.last_name;
      if (req.user.role && req.user.role === "Admin") {
        role = req.user.role.toUpperCase();
      }
    }

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
    logger.error('failed to retrieve products', error)
    res.status(500).send({
      status: 500,
      result: "Error",
      error: "Error getting products"
    })
  }
});

// create product
router.get("/new", passport.authenticate("jwt", { session: false }), checkPermissions("Admin"), (req, res) => {
  res.render("new-product", {
    style: 'new-product.css',
  });
});



// get product by id
router.get("/:id", async (req, res) => {

  let id = req.params.id;
  if (!id) {
    res.redirect("/");
  }

  try {
    let product = await ProductsDAO.getById(id);
    if (!product) {
      res.render('404', {
        style: "404.css"
      }
      );
    }
  
    // aca iria un repository con un DTO que prepare el producto para renderizarlo
  
    res.render('product', {
      title: product.title,
      description: product.description,
      price: product.price,
      photo: product.photo,
      category: product.category,
      isStock: product.stock > 0,
      style: 'product.css'
    });
    
  } catch (error) {
      logger.error(`Could not find item with id ${id}`, error);
      res.status(400).send({
        status: 400,
        result: "Error",
        error: "Error getting product"
      })
  }
})

router.post("/", upload.single('image'), async (req, res) => {


  let filename = req.file.filename;
  let product = req.body;

  // aca podria ir un DTO de productos. 

  await ProductsDAO.add(product.title, product.description, product.code, product.price, product.status, product.stock, product.category, filename, product.quantity);
  res.redirect("/");
})



// delete product
router.get("/delete/:id", passport.authenticate("jwt", { session: false }), checkPermissions("Admin"), async (req, res) => {
  try {
    let id = req.params.id;
    if (!id) {
      return res.render("products", {
        style: 'product.css'
      });
    }
    await ProductsDAO.remove(id);
    logger.info('Product deleted successfully');
    res.json({ success: true, message: 'Product deletion success' });
  } catch (e) {
    console.error('Error while trying to delete product:', e);
    res.status(500).json({ success: false, message: 'Error while trying to delete product' });
  }
})



// update product
router.get("/product-edit/:id", passport.authenticate("jwt", { session: false }), checkPermissions("Admin"), async (req, res) => {

  let id = req.params?.id;

  if (!id) {
    res.redirect("/");
  }
  try {
    let product = await ProductsDAO.getById(id);
    if (!product) {
      res.render("404", {
        style: "404.css"
      });
    }
    logger.info('Product updated successfully')
    res.render('productUpdate', {
      title: product.title,
      description: product.description,
      price: product.price,
      photo: product.photo,
      isStock: product.stock > 0,
      id: product._id,
      style: 'product-update.css'
    });
  } catch (error) {
      logger.error('There was a proble while attempting to update product', error)
  }
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

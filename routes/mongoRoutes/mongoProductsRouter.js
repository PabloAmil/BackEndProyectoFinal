import { Router, json, query } from "express";
import ProductsDAO from "../../src/dao/mongoDbManagers/productsDbManager.js";
import upload from "../../utils/upload.middlewares.js";
import passport from "passport";
import checkPermissions from "../../utils/auth.middleware.js";
import logger from "../../app.js";
import productIntputChecker from "../../utils/productInputChecker.js";
import transport from "../../src/config/mailing.js";
import userService from "../../src/repositories/usersRepository.js";
import config from "../../src/config/config.js";
import optionalAuthenticate from "../../utils/optional.authenticate.js";
import checkAuthMethod from "../../utils/checkAuthMethod.js";

const router = Router();

// get products
router.get("/", optionalAuthenticate, async (req, res) => {

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
    let userCart;

    if (req.user) {
      user = req.user.first_name;
      userLastName = req.user.last_name;
      userCart = req.user.cart;
      if (req.user.role && req.user.role === "Admin") {
        role = req.user.role.toUpperCase();
      }
    }

    let products = await ProductsDAO.paginate(filter, { page, limit, lean: true, sort: { price: sort } })

    products.prevLink = products.hasPrevPage ? `${config.serverUrl}/api/products/page=${products.prevPage}` : '';
    products.nextLink = products.hasNextPage ? `${config.serverUrl}/api/products/page=${products.nextPage}` : '';

    res.render("products", {
      style: 'products.css',
      products,
      user,
      userLastName,
      role,
      userCart
    });

  } catch (error) {
    logger.error('Failed to retrieve products', error)
    res.status(500).send({
      status: 500,
      result: "Error",
      error: "Error getting products"
    })
  }
});

// create product
router.get("/new", checkAuthMethod, checkPermissions("Premium"), (req, res) => {


  if (req.user) {
    res.render("new-product", {
      style: 'new-product.css',
    });
  }
  else {
    res.status(401).send();
  }
});


// get product by id
router.get("/:id", checkAuthMethod, checkPermissions("User"), async (req, res) => {

  const user = req.user;
  const cartId = user.cart;

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
      )
    }

    res.render('product', {
      product,
      isStock: product.stock > 0,
      cartId,
      style: 'product.css',
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

router.post("/", upload.single('image'), checkAuthMethod, async (req, res) => {

  let filename = req.file.filename;
  let owner = req.user.email
  let product = { ...req.body, owner };

  // aca podria ir un DTO de productos. 

  const check = productIntputChecker(product);
  if (check === false) {
    return res.status(400).send("All fields must be completed");
  }
  try {
    await ProductsDAO.add(product.title, product.description, product.code, product.price, product.status, product.stock, product.category, filename, product.owner);
    res.redirect("/");
  } catch (error) {
    logger.warning("All fields must be completed");
    res.status(400).send("Error while trying to create product");
  }
});

// delete product
router.get("/delete/:id", checkAuthMethod, async (req, res) => {

  try {
    let id = req.params?.id;
    if (!id) {
      return res.render("products", {
        style: 'product.css'
      });
    }

    let product = await ProductsDAO.getById(id)

    if (req.user.email === product.owner || req.user.role === "Admin") {

      let producOwner = await userService.getUsersByEmail(product.owner);
      if (producOwner.role === "Premium") {

        let result = await transport.sendMail({
          from: config.gmailUSer,
          to: producOwner.email,
          subject: 'A product of yours has been deleted by an Admin',
          html: `
          <div>
          <h3>Hi, ${req.user.first_name}</h3>
          <p>An Admin has erased your product: ${product.title}</p>
          </div>
          `,
          attachments: []
        })
      }

      await ProductsDAO.remove(id);
      logger.info('Product deleted successfully');
      res.json({ success: true, message: 'Product deletion success' });
    } else {
      res.status(401).json({ message: 'Only the product creator or an Admin can delete this product' })
    }

  } catch (e) {
    console.error('Error while trying to delete product:', e);
    res.status(500).json({ success: false, message: 'Error while trying to delete product' });
  }
})


// update product
router.get("/product-edit/:id", checkAuthMethod, checkPermissions("Admin"), async (req, res) => {

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

    if (req.user.email === product.owner || req.user.role === "Admin") {

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
    }

    else {
      res.status(401).send({ message: `Sorry, you dont have the credentials to modify this product` });
    }
  } catch (error) {
    logger.error('There was a problem while attempting to update product', error)
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

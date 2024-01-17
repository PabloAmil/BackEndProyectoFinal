const fs = require('fs');
const path = require('path');
let id = 0;

const getProducts = async () => {

  try {
    const products = await getProductsFromDa
    taBase();
    return products;
  } catch (e) {
    console.log(e)
  }
}

const showXnumberOfProducts = async (limit) => {

  let convertedLimit = parseInt(limit);
  if (isNaN(convertedLimit)) {
    return 'La cantidad debe ser un numero no menor a 0';
  }
  try {
    let products = await getProductsFromDataBase();
    if (convertedLimit <= 0) {
      return 'La cantidad debe ser un numero no menor a 0';
    }
    let delimitedProducts = products.slice(0, convertedLimit);
    return delimitedProducts;
  } catch (e) {
    console.log(e);
  }
}

const getProductsById = async (id) => {

  try {
    let products = await getProductsFromDataBase();
    let product = products.find((product) => product.id === id);
    if (product) {
      return product;
    }
    else {
      console.log("Product not found");
      return false;
    }
  } catch (e) {
    console.log(e)
  }
}

const getProductsFromDataBase = async () => {

  try {
    const products = await fs.promises.readFile(path.join(__dirname, 'products.txt'), 'utf-8');
    return JSON.parse(products);
  } catch (e) {
    console.log(e)
  }
}

const updateProducts = async (id, body) => {

  try {
    let product = await getProductsById(id);
    if (Object.keys(body).some((key) => key === 'id')) {
      return false;
    } else {
      let updatedProduct = {
        ...product,
        ...body
      }
      product = updatedProduct;

      let oldProducts = await getProductsFromDataBase();
      let index = oldProducts.findIndex((prod) => prod.id === product.id);
      if (index !== -1) {
        oldProducts[index] = product;
        writeDataBase(oldProducts);
      } else {
        return false;
      }
      return true;
    }
  } catch (e) {
    console.log(e)
  }
}

const createNewProduct = async (product) => {

  if (productHasAllKeys(product)) {
    let productToAdd = {
      ...product, id
    }
    id++;
    let oldProducts = await readDataBase();
    oldProducts.push(productToAdd);
    let newProductsArray = oldProducts;
    await writeDataBase(newProductsArray);
    return true;
  } else {
    return false;
  };
}

const productHasAllKeys = (product) => {

  const expectedKeys = ['title', 'description', 'price', 'code', 'stock', 'status', 'category'];
  const productKeys = Object.keys(product);
  if (expectedKeys.every((key) => productKeys.includes(key)) ||
    productKeys.length === expectedKeys.length + 1) {
    return true;
  } else {
    return false;
  }
}

const deleteProduct = async (id) => {

  try {
    let oldProducts = await readDataBase();
    let index = oldProducts.findIndex((prod) => prod.id === id);
    oldProducts.splice(index, 1);
    writeDataBase(oldProducts);
  } catch (e) {
    console.log(e);
  }
}

const readDataBase = async () => {

  try {
    const oldProducts = await fs.promises.readFile(path.join(__dirname, 'products.txt'), 'utf-8');
    let oldProductsArray = JSON.parse(oldProducts);
    return oldProductsArray;
  } catch (e) {
    console.log(e);
  }
}

const writeDataBase = async (ProductsArray) => {
  await fs.promises.writeFile(path.join(__dirname, 'products.txt'), JSON.stringify(ProductsArray));
}

module.exports = { getProducts, showXnumberOfProducts, getProductsById, createNewProduct, updateProducts, deleteProduct };



















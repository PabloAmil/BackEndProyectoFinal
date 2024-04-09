import Products from "../../../schemas/products.schema.js";

class ProductsDAO {

  static async getAll() {
    try {
      return Products.find().lean();
    } catch (e) {
      console.log('Error al traer los productos');
    }
  }

  static async getAllWithStock() {
    try {
      return Products.find({ stock: { $gt: 0 } }).lean();
    } catch (e) {
      console.log('error while attempting to retrieve the products');
    }
  }

  static async getById(id) {
    try {
      return Products.findOne({ _id: id }).lean();
    } catch (e) {
      console.log(`error while attempting to retrieve the product  ${id}`);
    }
  }

  static async add(title, description, code, price, status, stock, category, photo) {
    try {
      return new Products({ title, description, code, price, status, stock, category, photo }).save();
    } catch (e) {
      console.log(`error while attempting to add product` + e);
    }
  }

  static async update(id, data) {
    try {
      return Products.findOneAndUpdate({ _id: id }, data);
    } catch (e) {
      console.log(`error while attempting to update the product ${id}`);
    }
  }

  static async remove(id) {
    try {
      return Products.findByIdAndDelete(id);
    } catch (e) {
      console.log(`error while attempting to delete the product ${id}`);
    }
  }

  static async paginate(filter, options) {
    try {
      return Products.paginate(filter, options);
    } catch (e) {
      console.log('Products not found', e);
    }
  }
}


export default ProductsDAO;
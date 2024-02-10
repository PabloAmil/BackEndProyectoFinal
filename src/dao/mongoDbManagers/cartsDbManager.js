import Carts from "../../../schemas/carts.schema.js";

class cartsInDb {
  static async getAll() {
    try {
      return Carts.find().lean();
    } catch (e) {
      console.log(`could not get carts`);
    }
  }

  static async getCartById(id) {
    try {
      return Carts.findOne({ _id: id }).lean();
    } catch (e) {
      console.log(`cart ${id} cannot be found`);
    }
  }

  static async createNewCart(content = []) {
    try {
      return new Carts({content}).save();
    } catch (e) {
      console.log(`cart creation failed`);
    }
  }

  static async updateCart(id, data) {
    try {
      return Carts.findOneAndUpdate({ _id: id }, data);
    } catch (e) {
      console.log(`cart update failed, cart id: ${id}`);
    }
  }
}

export default cartsInDb;
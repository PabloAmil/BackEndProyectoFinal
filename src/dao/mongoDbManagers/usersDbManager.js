import Users from "../../../schemas/users.schema.js"

class UsersDAO {
  static async getUsersByEmail(email) {
    return await Users.findOne({email});
  }

  // static async getUsersByCreds(email, password) {
  //   return await Users.findOne({email, password});
  // }

  static async insert(first_name, last_name, age, email, password) {
    return await new Users({first_name, last_name, age, email, password}).save();
  }

  static async getUserById(id) {
    return await Users.findOne({_id: id}, {first_name:1, last_name:1, age:1, email:1, password:1}).lean();
  }

  static async updateUser(email, data) {
    return await Users.findOneAndUpdate({email: email}, data);
  }
}

export default UsersDAO;
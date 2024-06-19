import Users from "../../../schemas/users.schema.js"
import daysDifference from "../../../utils/getDaysDifference.js";
import transport from "../../config/mailing.js";
import config from "../../config/config.js";


class UsersDAO {

  static async getAllUsers() {
    return await Users.find().lean();
  }

  static async getUsersByEmail(email) {
    return await Users.findOne({ email });
  }

  static async getUsersByCreds(email, password) {
    return await Users.findOne({ email, password });
  }

  static async insert({ first_name, last_name, age, email, password, cart }) {
    return await new Users({ first_name, last_name, age, email, password, cart }).save();
  }

  static async getUserById(id) {
    return await Users.findOne({ _id: id }, { first_name: 1, last_name: 1, age: 1, email: 1, password: 1, role: 1, cart: 1, documents: 1, last_conection: 1 }).lean();
  }

  static async updateUser(email, data) {
    return await Users.findOneAndUpdate({ email: email }, data);
  }

  static async deleteAllExpiredUsers() {
    let users = await this.getAllUsers();
    const today = new Date();

    for (let user of users) {
      let userLastConnection = new Date(user.last_conection);
      let difference = daysDifference(userLastConnection, today);

      if (difference > 2) {
        if (user.role === 'Premium') {
          try {
            await transport.sendMail({
              from: config.gmailUSer,
              to: user.email,
              subject: 'Account deletion',
              html: `
                        <p>
                            Dear ${user.first_name}, your account has been deleted due to inactivity
                        <p>
                        `,
              attachments: []
            });
          } catch (error) {
            console.error(`Error sending email to ${user.email}:`, error);
          }
        }
        let deletions = await Users.findByIdAndDelete(user._id)
        return deletions;
      }
    }
    return true;
  }

  static async modifyOrDeleteUsers(users) {

    for (let user of users) { 
      let oldUser = await this.getUserById(user.id);
      if (oldUser.role !== user.role) {
        oldUser.role = user.role;
        let result = await this.updateUser(oldUser.email, oldUser);
      }
      if (user.erase === true) {
        await Users.findByIdAndDelete(user.id)
      }
    }

    return true;
  }
};

export default UsersDAO;
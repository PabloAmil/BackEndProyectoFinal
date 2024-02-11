import Messages from "../../../schemas/messages.schema.js";

class messagesInDb {

  static async getAll() {
    return Messages.find().lean();
  }

  static async add(userMail, message) {
    return new Messages({ userMail, message }).save();
  }
}

export default messagesInDb;
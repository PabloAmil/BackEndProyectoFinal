import Messages from "../../../schemas/messages.schema.js";

class messagesInDb {

  static async getAll() {
    return await Messages.find().lean();
  }

  static async add(userMail, message) {
    return await new Messages({ userMail, message }).save();
  }
}

export default messagesInDb;
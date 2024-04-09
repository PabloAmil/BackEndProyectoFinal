import ticketModel from "../../../schemas/tickets.schema.js";
import ProductsDAO from "./productsDbManager.js";

class ticketsDAO {

  static async generateCode(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return code;
  }

  static async getDatetime() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1; 
    const day = date.getDate();
    const hour = date.getHours();
    const minutes = date.getMinutes();

    const dateTime = `${day}/${month}/${year} - ${hour}:${minutes}`;
    return dateTime;
  }

  static async checkStock(cart_data) {

    // checkear en la base si cada item del cart en especifico tiene stock mayor o menor de lo que se eligio

    // necesita ademas crear un nuevo objeto con los ID de los que que no haya, o no haya suficientes, y actualizar el cart con esos, buscandolos
    

    
    

  }

  static async getAmount(cart_data) {
    // de los productos que SI hay stock sumarlos y buscar el precio

    let amount = 0;


    return 1;

  }

  static async createTicket(user) {
    try {
      return new ticketModel({ code: await ticketsDAO.generateCode(25), purchase_datetime: await  ticketsDAO.getDatetime(), amount: await ticketsDAO.getAmount(), purchaser: user.email }).save();
    } catch (e) {
      console.log(`something went wrong with your purchase` + e);
    }
  }

}


export default ticketsDAO;
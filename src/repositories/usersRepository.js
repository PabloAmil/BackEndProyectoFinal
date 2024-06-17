import usersDTO from "../dtos/usersDto.js";
import UsersDAO from "../dao/mongoDbManagers/usersDbManager.js";

class UsersRepository {
  constructor(DAO, DTO) {
    this.DAO = DAO,
    this.DTO = DTO
  }

  getUsers = async() => {
    let result = await this.DAO.getAllUsers();
    return result;
  }

  getUsersByEmail = async (email) => {
    let result = await this.DAO.getUsersByEmail(email);
    return result;
  }

  getUsersByCreds = async (email, password) => {
    let result = await this.DAO.getUsersByCreds(email, password);
    return result
  }

  insertUser = async ({first_name, last_name, age, email, password, cart}) => {
    let result = await this.DAO.insert({first_name, last_name, age, email, password, cart});
    return result;
  }

  getUserById = async (id) => {
    let result = await this.DAO.getUserById(id);
    return result;
  }

  updateUsers = async (email, data) => {
    let result = await this.DAO.updateUser(email, data);
    return result;
  }

  formatGithubDataForDAO = async (user_data, cartId) => {

    let result = await this.DTO.formatGithubDataForDAO(user_data, cartId);
    return result;
  }

  formatRegisterDataForDAO = async (user_data, cartId) => {
    let result = await this.DTO.formatRegisterDataForDAO(user_data, cartId);
    return result;
  }

  returnFormatedDataFromDAO = async (user_data) => {
    let result = await this.DTO.returnFormatedDataFromDAO(user_data);
    return result;
  }

  deleteOutOfDateUsers = async () => {
    let result = await this.DAO.deleteAllExpiredUsers();
    return result;
  }
}

const userService = new UsersRepository(UsersDAO, usersDTO);
export default userService;
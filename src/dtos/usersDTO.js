import { createHash, isValidPassword } from "../../utils/crypt.js";

class usersDTO {

  formatGithubDataForDAO(user_data, cartId) {

    let newUser = {
      first_name: user_data.name,
      last_name: "",
      age: 18,
      email: user_data.email,
      password: "",
      cart: cartId,
      _id: user_data._id
    }

    return newUser;
  }

  formatRegisterDataForDAO(user_data, cartId) {

    let newUser = {
      first_name: user_data.first_name,
      last_name:  user_data.last_name,
      age: 18,
      email: user_data.email,
      password: createHash(user_data.password),
      cart: cartId,
      _id: user_data._id
    }

    return newUser
  }

  returnFormatedDataFromDAO(user_data) {

    let user = {
      first_name: user_data.first_name,
      last_name: user_data.last_name,
      role: user_data.role,
      cart: user_data.cart,
      _id: user_data._id
    }

    return user;
  }
}

const usersDto = new usersDTO();
export default usersDto;
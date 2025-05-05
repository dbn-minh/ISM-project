import { responseData } from "../config/response.js";
import initModels from "../models/init-models.js";
import sequelize from "../models/connect.js";
import bcrypt from "bcrypt";

let model = initModels(sequelize);

export const login = async (req, res) => {
  let { user_name, user_password } = req.body;

  // check email and password == table user
  let checkUser = await model.users.findOne({
    where: {
      user_name,
    },
  });

  // exist => login successfully
  if (checkUser) {
    bcrypt.compare(user_password, checkUser.user_password, (err, result) => {
      if (err) {
        console.error(err);
        responseData(res, "An error occurred during login", "", 500);
        return;
      }

      if (result) {
        let token = { user_id: checkUser.user_id, role_id: checkUser.role_id };
        responseData(res, "Login successfully", token, 200);
      } else {
        // wrong password
        responseData(res, "Wrong password", "", 400);
      }
    });
  } else {
    // not exist
    responseData(res, "User doesn't exist", "", 400);
  }
};

export const signup = async (req, res) => {
  // try {
  let {
    full_name,
    address,
    user_name,
    bank_account,
    user_password,
    phone,
    email,
  } = req.body;

  // Validate bank account
  if (!/^[a-zA-Z\s]+-\d+$/.test(bank_account)) {
    return responseData(res, "Invalid bank account format", "", 400);
  }

  // Validate user password (must contain uppercase, lowercase, digit, and special character)
  if (
    !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}/.test(
      user_password
    )
  ) {
    return responseData(
      res,
      "Password must contain at least one uppercase letter, one lowercase letter, one digit, one special character, and be at least 8 characters long",
      "",
      400
    );
  }

  // Validate phone number (assuming phone number should be exactly 10 digits)
  if (!/^\d{10}$/.test(phone)) {
    return responseData(res, "Invalid phone number format", "", 400);
  }

  // Validate email address
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return responseData(res, "Invalid email address", "", 400);
  }

  let checkUser = await model.users.findOne({
    where: {
      user_name,
    },
  });

  if (checkUser) {
    return responseData(res, "Username already exists", "", 400);
  }

  //hash the pass
  let hashedPassword = bcrypt.hashSync(user_password, 10);

  let newData = {
    full_name,
    address,
    user_name,
    bank_account,
    user_password: hashedPassword,
    phone,
    email,
    role_id: 2,
  };

  await model.users.create(newData);

  responseData(res, "Sucessfully sign up", "", 200);
  // } catch {
  //   responseData(res, "Error", "", 500);
  // }
};

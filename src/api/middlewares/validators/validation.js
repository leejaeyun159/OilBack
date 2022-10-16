import joi from "joi";
import schema from "./schema";
import CustomError from "../../../utils/customError";

const AuthValidator = {
  register: (req, res, next) => {
    const value = joi
      .object({
        email: schema.email,
        password: schema.password,
        nickname: schema.nickname,
      })
      .validate(req.body);
    if (value.error) {
      const error = new CustomError("VALID_ERROR", 400, value.error.details[0].message);
      next(error);
    }
    next();
  },
};

export { AuthValidator };

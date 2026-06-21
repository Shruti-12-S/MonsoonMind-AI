import { ApiError } from "../utils/ApiError.js";

export const validate = (schema, property = "body") => (req, _res, next) => {
  const { error, value } = schema.validate(req[property], {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const details = error.details.map((item) => ({
      field: item.path.join("."),
      message: item.message
    }));
    return next(new ApiError(400, "Validation failed", details));
  }

  req[property] = value;
  return next();
};

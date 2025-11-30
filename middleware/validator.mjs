import { validationResult } from "express-validator";

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  console.log("❌ validate error, body =", req.body);
  console.log("❌ errors =", errors.array());

  return res.status(400).json({ message: errors.array()[0].msg });
};

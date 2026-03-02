import Joi from "joi";

const registerSchema = Joi.object({
  username: Joi.string()
    .min(3)
    .max(30)
    .required(),

  password: Joi.string()
    .min(6)
    .max(255)
    .required(),

  passwordConfirm: Joi.string()
    .required()
});

export function validateRegister(req, res, next) {
  const { error } = registerSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      error: error.details[0].message
    });
  }

  next();
}
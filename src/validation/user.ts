import Joi, { LanguageMessages } from "joi";

export const translate = (lang: string): LanguageMessages => {
  const eng = lang === "en";

  return {
    "string.empty": eng ? "{#key} is required" : "{#key} harus diisi",
    "string.min": eng
      ? "{#key} must have contain at least {#limit} characters"
      : "{#key} harus mengandung minimal {#limit} karakter",
  };
};
// "any.only"
export const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().min(8).required(),
});

export const changePasswordSchema = Joi.object({
  username: Joi.string().required(),
  current_pass: Joi.string().required(),
  new_pass: Joi.string().min(8).required(),
  conf_pass: Joi.string().min(8).required(),
});

export const registerSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  username: Joi.string(),
  email: Joi.string().email().required(),
  mobile: Joi.string().min(10),
  password: Joi.string().min(8).required(),
  confirm_password: Joi.string().min(8),
  country_code: Joi.string(),
});

export const updateSchema = Joi.object({
  name: Joi.string().min(3).max(30),
  username: Joi.string(),
  mobile: Joi.string().min(10),
  country_code: Joi.string(),
  country: Joi.string(),
  province: Joi.string(),
  location: Joi.string(),
  date_of_birth: Joi.string(),
});

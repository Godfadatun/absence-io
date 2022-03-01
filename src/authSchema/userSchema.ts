import joi from 'joi';

export const createUserSchema = joi.object().keys({
    email: joi.string().email().required(),
    password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    first_name: joi.string().required(),
    last_name: joi.string().required(),
  });

  export const userSignInSchema = joi.object().keys({
    email: joi.string().email().required(),
    password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
  });
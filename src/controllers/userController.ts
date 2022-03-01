import { HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { createUserSchema, userSignInSchema } from '../authSchema/userSchema';
import { UserModel } from '../database/models/user';
import { createUserDTO, userSignInDTO } from '../dto/userDTO';
import { sendObjectResponse, BadRequestException } from '../utils/errors';
import { theResponse } from '../utils/interface';
import { IUser } from '../database/interfaces/user';
import { generateToken } from '../utils/jwt';

/**
 * A Function that handles user signup
 * @param data this is an object of the [[createUserDTO]] passed in
 * @returns an error response | a success message using [[theResponse]]
 * @responses [[BadRequestException]] for Negative Response && [[sendObjectResponse]] for Positive Response
 * @validation [[createUserSchema]] is used to handle the request validation
 * @Models [[UserModel]] for the user model
 * @TypeCheck [[IUser]] for type checking the user model
 */
export const createUserCONTROLLER = async (data: createUserDTO): Promise<theResponse> => {
  const validation = createUserSchema.validate(data);
  if (validation.error) return BadRequestException(validation.error.message);

  const { email, password, first_name, last_name } = data;
  try {
    const user = await UserModel.findOne({ email }).exec();
    if (user) throw Error(`user already exists`);

    const newUserCreated: HydratedDocument<IUser> = new UserModel({ email, password: bcrypt.hashSync(password, 8), first_name, last_name });
    await newUserCreated.save();

    return sendObjectResponse('User Account Created');
  } catch (e: any) {
    return BadRequestException(e.message || 'User creation failed, kindly try again', e.data);
  }
};

/**
 * A Function that handles user signin
 * @param data this is an object of the [[userSignInDTO]] passed in
 * @returns an error response | a success message using [[theResponse]]
 * @responses [[BadRequestException]] for Negative Response && [[sendObjectResponse]] for Positive Response
 * @validation [[userSignInSchema]] is used to handle the request validation
 * @Models [[UserModel]] for the user model
 */
export const userSignInCONTROLLER = async (data: userSignInDTO): Promise<theResponse> => {
  const validation = userSignInSchema.validate(data);
  if (validation.error) return BadRequestException(validation.error.message);

  const { email, password } = data;
  try {
    const user = await UserModel.findOne({ email }).exec();
    if (!user) throw Error(`user does not exists`);
    if (!bcrypt.compareSync(password, user.password)) throw Error('Invalid login details');

    const token = generateToken(user);
    return sendObjectResponse(`Logged into ${user.first_name} ${user.last_name} Account`, { user, token });
  } catch (e: any) {
    return BadRequestException(e.message || 'User creation failed, kindly try again', e.data);
  }
};

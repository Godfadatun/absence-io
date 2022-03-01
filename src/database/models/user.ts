// import mongoose from "mongoose";
import { Schema, model } from 'mongoose';
import { IUser } from '../interfaces/user';

const UserSchema = new Schema<IUser>(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

export const UserModel = model<IUser>('User', UserSchema);

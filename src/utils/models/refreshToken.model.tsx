import mongoose from 'mongoose';
import { usersModel } from './user.model';

const schema = new mongoose.Schema({
  token: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  expiryDate: { type: Date, required: true },
});

export const refreshTokenModel = mongoose.model('refreshtoken', schema);
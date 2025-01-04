import crypto from 'crypto';
import { refreshTokenModel } from '../models/refreshToken.model';
import { Types } from 'mongoose';

// Function to generate a new refresh token
export const generateRefreshToken = (userId : Types.ObjectId) => {
  const token = crypto.randomBytes(40).toString('hex');
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 30); // 30 days expiration
  const refreshToken = new refreshTokenModel({ token, userId, expiryDate });
  return refreshToken.save();
};
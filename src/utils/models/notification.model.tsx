import mongoose from "mongoose";
import { usersModel } from "./user.model";
import { postModel } from "./post.model";
import { commentModel } from "./comment.model";
// Create the notification schema
const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['like', 'comment', 'follow'],
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'post',
      required: false,
    },
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'comment',
      required: false,
    },
    message: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Export the notification model
export const notificationModel = mongoose.models.notification || mongoose.model('notification', notificationSchema);
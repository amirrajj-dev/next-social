import mongoose from "mongoose";
import { postModel } from "./post.model";
import { commentModel } from "./comment.model";
import { likeModel } from "./like.model";
import { notificationModel } from "./notification.model";

const schema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    img: {
      type: String,
    },
    gender: {
      type: String,
      enum: ['male', 'female'],
      required: true,
    },
    bio: {
      type: String,
    },
    location: {
      type: String,
    },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post',
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comment',
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'like',
      },
    ],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
      },
    ],
    notifications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'notification',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// the above code is a middleware (pre middleware) and the performance is like this that when a user delete his account all posts and comments that created by that user
//will get deleted authomatically in this approach you should definitly use remove for deleting a user from the database user.remove() forexample
schema.pre('remove', async function (next) {
    try {
      await postModel.deleteMany({ author: this._id });
      await commentModel.deleteMany({ author: this._id });
  
      // Remove the user from followers and following lists of other users
      await usersModel.updateMany({ followers: this._id }, { $pull: { followers: this._id } });
      await usersModel.updateMany({ following: this._id }, { $pull: { following: this._id } });
      next();
    } catch (error) {
      next(error);
    }
  });  

export const usersModel = mongoose.models.user || mongoose.model('user', schema);
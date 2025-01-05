import mongoose from "mongoose";
import { usersModel } from "./user.model";
import { postModel } from "./post.model";

const schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'post',
      required: false,
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

// Ensuring post is provided
schema.pre('save', function (next) {
  if (!this.post) {
    return next(new Error('A like must be associated with a post'));
  }
  next();
});

export const likeModel = mongoose.models.like || mongoose.model('like', schema);
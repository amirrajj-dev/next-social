import mongoose from "mongoose";
import { postModel } from "./post.model";
import { usersModel } from "./user.model";

const schema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'post',
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
      },
    ],
    replies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comment',
      },
    ],
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

// Adding a virtual field to get the number of likes
schema.virtual('likeCount').get(function () {
  return this.likes.length;
});

// Adding a virtual field to get the number of replies
schema.virtual('replyCount').get(function () {
  return this.replies.length;
});

export const commentModel = mongoose.models.comment || mongoose.model('comment', schema);
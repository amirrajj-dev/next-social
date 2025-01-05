import mongoose from "mongoose";
import { usersModel } from "./user.model";
import { commentModel } from "./comment.model";
import { notificationModel } from "./notification.model";

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
    image: {
      type: String,
      default: null,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comment',
      },
    ],
    notifications: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'notification',
        }
    ]
  },
  {
    // nothing complicated just deletes _v from rach documnet when converting it to json format
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

// Adding a virtual field to get the number of comments
schema.virtual('commentCount').get(function () {
  return this.comments.length;
});

export const postModel = mongoose.models.post || mongoose.model('post', schema);
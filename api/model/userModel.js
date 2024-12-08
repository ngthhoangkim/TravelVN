import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
    },
    fullname: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: function () {
        // Mật khẩu chỉ yêu cầu khi không có facebookId và googleId
        this.googleId;
      },
    },
    username: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    bio: {
      type: String,
    },
    birthday: {
      type: Date,
    },
    gender: {
      type: String,
    },
    avatar: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Image",
    },
    photos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Image",
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;

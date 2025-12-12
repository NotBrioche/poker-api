import mongoose, { Schema } from "mongoose";

const User = new Schema({
  username: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  chips: {
    type: Number,
    required: true,
    default: 10000,
  },
  verified: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const schema = mongoose.model("User", User);

export default schema;

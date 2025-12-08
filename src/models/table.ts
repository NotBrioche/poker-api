import mongoose, { Schema } from "mongoose";

const Table = new Schema({
  name: {
    type: String,
    required: true,
  },
  users: {
    type: [String],
    required: true,
  },
  blindPrice: {
    type: Number,
    required: true,
  },
  raiseLimit: {
    type: Number,
    required: false,
  },
});

const model = mongoose.model("Table", Table);

export default model;

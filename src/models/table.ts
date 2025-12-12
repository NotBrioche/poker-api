import mongoose, { Schema } from "mongoose";

const Table = new Schema({
  name: {
    type: String,
    required: true,
  },
  hostId: {
    type: String,
    required: true,
  },
  users: {
    type: [String],
    required: true,
  },
  started: {
    type: Boolean,
    default: false,
  },
  blindPrice: {
    type: Number,
    required: true,
  },
  raiseLimit: {
    type: Number,
    required: false,
  },
  pot: {
    type: Number,
    required: true,
    default: 0,
  },
  tableCards: {
    type: [Number],
    required: true,
    default: [],
  },
  bigBlindIndex: {
    type: Number,
    required: true,
    default: 0,
  },
  isFree: {
    type: Boolean,
    required: true,
    default: false,
  },
  chips: {
    type: Number,
    required: true,
    default: 0,
  },
  status: {
    type: String,
    enum: [
      "creating",
      "waiting",
      "dealing",
      "playerChoice",
      "showdown",
      "break",
    ],
    default: "creating",
  },
});

Table.pre("save", function () {
  if (["creating", "waiting"].includes(this.status)) {
    this.started = false;
  } else {
    this.started = true;
  }
});

const model = mongoose.model("Table", Table);

export default model;

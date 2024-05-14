const mongoose = require("mongoose");

const habitSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      immutable: true,
    },
    status: {
      type: String,
      enum: ["completed", "pending"],
      default: "pending",
    },
    habitId: {
      type: mongoose.Types.ObjectId,
      required: true,
      immutable: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Status = mongoose.model("status", habitSchema);

module.exports = Status;

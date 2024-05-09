const mongoose = require("mongoose");

const habitSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      immutable: true,
      ref: "logindetails",
    },
    habitId: {
      type: mongoose.Types.ObjectId,
      required: true,
      immutable: true,
      ref: "habits",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Habit = mongoose.model("Habit", habitSchema);

module.exports = Habit;

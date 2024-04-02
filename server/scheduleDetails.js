const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  email: String,
  name: String,
  date: String,
  time: String,
  repeat: Boolean,
});

mongoose.model("schedule", scheduleSchema);



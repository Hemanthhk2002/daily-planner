const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  email: String,
  name: String,
  description: String,
  date: String,
  time: String,
  repeat: Boolean,
});

mongoose.model("schedule", scheduleSchema);

// const mongoose = require('mongoose');

// const scheduleSchema = new mongoose.Schema({
//   email: {
//     type: String,
//     required: true
//   },
//   name: {
//     type: String,
//     required: true
//   },
//   date: {
//     type: Date,
//     required: true
//   },
//   time: {
//     type: String,
//     required: true
//   },
//   repeat: {
//     type: Boolean,
//     required: true
//   },
//   repeatOnDays: {
//     type: [String],
//     required: false
//   }
// });

// module.exports = mongoose.model('schedule', scheduleSchema);

// const mongoose = require("mongoose");

// const scheduleSchema = new mongoose.Schema({
//   email: {
//     type: String,
//     required: true,
//   },
//   name: {
//     type: String,
//     required: true,
//   },
//   description: { // New attribute for description
//     type: String, // Assuming description is a string
//     required: true, // Modify as needed based on your requirements
//   },
//   date: {
//     type: Date,
//     required: true,
//   },
//   time: {
//     type: String,
//     required: true,
//   },
//   repeat: {
//     type: Boolean,
//     required: true,
//   },
// });

// module.exports = mongoose.model("schedule", scheduleSchema);

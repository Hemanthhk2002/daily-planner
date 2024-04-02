const mongoose = require("mongoose");

const userDetailsSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, require: true },
    name: { type: String, require: true },
    pswd: { type: String, require: true },
  },
  {
    timestamps: true,
  }
);

mongoose.model("logindetails", userDetailsSchema);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const logindb = require("./userDetails");
const scheduleSchema = require("./scheduleDetails");

const cors = require("cors");

// const {
//   default: AsyncStorage,
// } = require("@react-native-async-storage/async-storage");
// // const user = require("./userDetails");

mongooseURL =
  "mongodb+srv://hemanth:1234567890@cluster0.97vwsgo.mongodb.net/demoOne?retryWrites=true&w=majority";
  //mongooseURL = "mongodb://127.0.0.1:27017/planner";
app.use(express.json());

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST"], // Allow only GET and POST requests
  allowedHeaders: ["Content-Type", "Authorization"], // Allow only specific headers
};

app.use(cors(corsOptions));

mongoose
  .connect(mongooseURL)
  .then(() => {
    console.log("DB Connected successfully");
  })
  .catch((err) => {
    console.error(err);
  });

const user = mongoose.model("logindetails");

app.post("/register", async (req, res) => {
  const { email, name, pswd } = req.body;
  console.log(email);
  const oldUser = await user.findOne({ email: email });
   const existuser= await user.findOne({password:req.body.password})
    const t = await user.find();
  if (oldUser) {
    return res.send({ data: "User already exists!!" });
  }

  try {
    await user.create(req.body);

    res.send({ status: "ok", success: true, data: "User created" });
  } catch (error) {
    console.log(error);
  }
});

app.post("/user-login", async (req, res) => {
  const { email, pswd } = req.body;
  const oldUser = await user.findOne({ email: email });

  if (!oldUser) {
    return res.send({message: "user not exist"});
  }
  else if (pswd == oldUser.pswd) {
    const scheduleData = await schedule.find({ email: oldUser.email }); 
    res.send({ status: "ok", message: "User loggedin", data: oldUser });
    console.log("User loggedin");
  } else {
    console.log(pswd+" "+oldUser.pswd);
    res.send({ status: "no", message: "password not matched" });
  }
});

const schedule = mongoose.model("schedule");

app.post("/add", async (req, res) => {
  const { email, name, date, time, repeat } = req.body;
  console.log(email);

  try {
    await schedule.create({
      email: email,
      name: name,
      date: date,
      time: time,
      repeat: repeat,
    });

    res.send({ status: "ok", data: "Schedule created" });
  } catch (error) {
    console.log(error);
  }
});

app.post("/getSchedule", async (req, res) => {
  const { email, date } = req.body;
  console.log(email);

  try {
    const data = await schedule.find({ email: email, date: date });
    console.log(data);
    res.send({ status: "ok", data: data });
  } catch (error) {
    console.log(error);
  }

});

app.post("/reminder", async (req, res) => {

  const { email } = req.body;
  console.log(email);
  try {
    const data = await schedule.find({email: email});
    console.log(data);
    res.send({ status: "ok", data: data });
  } catch (error) {
    console.log(error);
  }
});

app.listen(3000, () => {
  console.log("Server listening in port 3000");
});

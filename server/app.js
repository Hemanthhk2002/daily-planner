const express = require("express");
const app = express();
const mongoose = require("mongoose");
const logindb = require("./userDetails");
const scheduleSchema = require("./scheduleDetails");
const jwt = require("jsonwebtoken");
const Habit = require("./habit");
const donenv = require("dotenv").config();

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
  const existuser = await user.findOne({ password: req.body.password });
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
    return res.send({ message: "user not exist" });
  } else if (pswd == oldUser.pswd) {
    const scheduleData = await schedule.find({ email: oldUser.email });
    const token = jwt.sign(
      { userId: oldUser._id, email: oldUser.email },
      process.env.AUTHENTICATION_KEY
    );
    res
      .status(200)
      .json({ status: "ok", message: "User loggedin", data: oldUser, token });
    console.log("User loggedin");
  } else {
    console.log(pswd + " " + oldUser.pswd);
    res.status(500).json({ status: "no", message: "password not matched" });
  }
});

const schedule = mongoose.model("schedule");

app.post("/add", async (req, res) => {
  const { email, name, description, category, date, time, repeat, repeatOnDays } = req.body;

  try {
    const temp = await schedule.create({
      email,
      name,
      description,
      category,
      date,
      time,
      repeat,
      repeatOnDays,
    });
    console.log(temp);
    res.send({ status: "ok", message: "Schedule created", data: temp });
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

app.post("/getAllSchedules", async (req, res) => {
  const { email } = req.body;

  try {
    const data = await schedule.find({ email: email });
    console.log(data);
    res.send({ status: "ok", data: data });
  } catch (error) {
    console.log(error);
  }
});

app.post("/getCategorizedSchedule", async (req, res) => {
  const { email, date, category } = req.body;
  console.log(category);

  try {
    const data = await schedule.find({ email: email, date: date, category: category });
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
    const data = await schedule.find({ email: email });
    console.log(data);
    res.send({ status: "ok", data: data });
  } catch (error) {
    console.log(error);
  }
});

app.post("/deleteScheduleItem", async (req, res) => {
  const id = req.body._id; // Extract the _id from the request body

  console.log(req.body._id);

  try {
    const data = await schedule.deleteOne({ _id: id }); // Use the _id in the query

    //console.log(data);

    res.send({ status: "ok", data: data });
  } catch (error) {
    console.log(error);

    res
      .status(500)
      .send({ status: "error", message: "Failed to delete schedule item" });
  }
});

//-----------------------------[ H A B I T ]------------------------

app.post("/habits", async (req, res) => {
  console.log(req.headers);
  console.log("habits....", req.body);
  try {
    if (req.headers["token"] != null) {
      if (jwt.verify(req.headers["token"], process.env.AUTHENTICATION_KEY)) {
        const userId = jwt.decode(req.headers["token"]).userId;
        const { title, color, repeatMode, reminder } = req.body;

        const newHabit = new Habit({
          userId,
          title,
          color,
          repeatMode,
          reminder,
        });

        const savedHabit = await newHabit.save();
        res.status(200).json(savedHabit);
      } else {
        res.status(401).json({ message: "Unauthorized please contact admin" });
      }
    } else {
      res.status(401).json({ message: "No token found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Network error" });
  }
});

app.get("/habitslist", async (req, res) => {
  try {
    console.log(req.headers);
    if (req.headers["token"] != null) {
      if (jwt.verify(req.headers["token"], process.env.AUTHENTICATION_KEY)) {
        const userId = jwt.decode(req.headers["token"]).userId;
        const allHabits = await Habit.find({ userId });
        res.status(200).json(allHabits);
      } else {
        res.status(401).json({ message: "Unauthorized please contact admin" });
      }
    } else {
      res.status(401).json({ message: "No token found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/getStatus", async (req, res) => {
  try {
    if (req.headers["token"] != null) {
      if (jwt.verify(req.headers["token"], process.env.AUTHENTICATION_KEY)) {
        const userId = jwt.decode(req.headers["token"]).userId;
        const allHabits = await Habit.aggregate([
          {
            $match: { userId: new mongoose.Types.ObjectId(userId) },
          },
          // {
          //   $group:{
          //     _id:"$"
          //   }
          // }
        ]);
        res.status(200).json(allHabits);
      } else {
        res.status(401).json({ message: "Unauthorized please contact admin" });
      }
    } else {
      res.status(401).json({ message: "No token found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/habits/:habitId/completed", async (req, res) => {
  const habitId = req.params.habitId;
  const updatedCompletion = req.body.completed; // The updated completion object

  try {
    const updatedHabit = await Habit.findByIdAndUpdate(
      habitId,
      { completed: updatedCompletion },
      { new: true }
    );

    if (!updatedHabit) {
      return res.status(404).json({ error: "Habit not found" });
    }

    return res.status(200).json(updatedHabit);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.delete("/habits/:habitId", async (req, res) => {
  try {
    if (req.headers["token"] != null) {
      if (jwt.verify(req.headers["token"], process.env.AUTHENTICATION_KEY)) {
        // console.log("delete server");
        const { habitId } = req.params;

        await Habit.findByIdAndDelete(habitId);

        res.status(200).json({ message: "Habit deleted succusfully" });
      } else {
        res.status(401).json({ message: "Unauthorized please contact admin" });
      }
    } else {
      res.status(401).json({ message: "No token found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Unable to delete the habit" });
  }
});

const validation = (req, res, next) => {
  if (req.header["token"] != null) {
    if (jwt.verify(req.header["token"], process.env.AUTHENTICATION_KEY)) {
      next();
    } else {
      res.status(401).json({ message: "Unauthorized please contact admin" });
    }
  } else {
    res.status(401).json({ message: "No token found" });
  }
};

//-----------------------------[ H A B I T ]------------------------

app.listen(3000, () => {
  console.log("Server listening in port 3000");
});

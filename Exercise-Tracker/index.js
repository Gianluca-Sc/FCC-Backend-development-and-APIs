const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const users = require("./routes/users.js");

app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Routes
app.use("/api/users", users);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const listener = app.listen(process.env.PORT || 3000, () => {
      console.log("Your app is listening on port " + listener.address().port);
    });
  } catch (error) {
    console.log(error);
  }
};

start();

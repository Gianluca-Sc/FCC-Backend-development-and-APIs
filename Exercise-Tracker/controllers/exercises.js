const Exercise = require("../models/exercise");

const createExercise = async (req, res) => {
  try {
    const { description, duration, date } = req.body;
    const id = req.params["_id"];
    if (!id) return res.json({ msg: "Please insert id" });

    const exercise = await Exercise.create({
      username: id,
      description,
      duration,
      date: date || Date.now(),
    });

    await exercise.populate("username");

    res.json({
      _id: id,
      username: exercise.username.username,
      date: exercise.date.toDateString(),
      duration: +duration,
      description,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { createExercise };

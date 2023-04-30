//const Log = require("../models/logs");
const User = require("../models/user");
const Exercise = require("../models/exercise");
const exercise = require("../models/exercise");

const getUserLog = async (req, res) => {
  try {
    const limit = +req.query.limit || 50;
    const from = req.query.from || "1900-01-01";
    const to = req.query.to || Date.now().toString();

    const user = await User.findOne({ _id: req.params["_id"] });

    const exercises = await Exercise.find({
      username: user["_id"],
      date: { $gt: from, $lt: to },
    })
      .select({
        _id: 0,
        __v: 0,
        username: 0,
      })
      .limit(limit);

    const count = exercises.length;
    const newExercises = exercises.map((e) => {
      return {
        description: e.description,
        duration: e.duration,
        date: e.date.toDateString(),
      };
    });
    res.json({
      _id: user["_id"],
      username: user.username,
      count,
      log: newExercises,
    });
  } catch (error) {
    res.json({ msg: error });
  }
};

module.exports = { getUserLog };

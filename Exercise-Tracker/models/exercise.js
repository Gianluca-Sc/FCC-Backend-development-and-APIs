const mongoose = require("mongoose");
const { Schema } = mongoose;

const ExerciseSchema = new Schema({
  username: { type: Schema.Types.ObjectId, ref: "User" },
  description: String,
  duration: { type: Number, required: true },
  date: { type: Date, default: Date.now, required: true },
});

module.exports = mongoose.model("Exercise", ExerciseSchema);

const express = require("express");
const router = express.Router();

const { getAllUsers, createUser } = require("../controllers/users");
const { getUserLog } = require("../controllers/logs");
const { createExercise } = require("../controllers/exercises");

router.route("/").get(getAllUsers).post(createUser);
router.route("/:_id/exercises").post(createExercise);
router.route("/:_id/logs").get(getUserLog);

module.exports = router;

const User = require("../models/user");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.json({ msg: error });
  }
};

const createUser = async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) return res.json({ msg: "Please insert username" });
    
    // check if user already exists in the db
    const userFound = await User.findOne({ username });
    console.log(userFound);
    if (userFound) {
      return res.json({ msg: "users already exist" });
    } else {
      // create new user
      const user = await User.create({ username });
      const { _id } = user;
      res.json({ username, _id });
    }
  } catch (error) {
    res.json({ msg: error });
  }
};

module.exports = { getAllUsers, createUser };

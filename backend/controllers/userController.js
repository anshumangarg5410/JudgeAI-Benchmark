const User = require("../models/User");

exports.getUsers = async (req, res) => {
  try {
    const { email } = req.query;
    let query = {};
    if (email) {
      query.email = email.toLowerCase();
    }
    const users = await User.find(query);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

exports.createUser = async (req, res) => {
  try {
    const user = await User.create({
      ...req.body,
      email: req.body.email ? req.body.email.toLowerCase() : undefined
    });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to create user" });
  }
};

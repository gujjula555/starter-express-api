const User = require("../models/User");
const verify = require("./authVerify");

const router = require("express").Router();


router.get("/allusers", verify, async (req, res) => {
  try {
    const results = await User.find().exec();
    res.send(results);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete("/allusers", verify, async (req, res) => {
  try {
    const results = await User.delete().exec();
    res.send(results);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete("/user", verify, async (req, res) => {
  try {
    const results = await User.deleteOne({ email: req.body.email }).exec();
    res.send(results);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;

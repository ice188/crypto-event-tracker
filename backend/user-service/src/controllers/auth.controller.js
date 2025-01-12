const asyncHandler = require("express-async-handler");
const { User } = require("../models/user.model");

const userAuth = asyncHandler(async (req, res) => {
  const { email, user_name, picture, oauth_provider } = req.body;

  let user = await User.findOne({ where: { email, oauth_provider } });

  if (!user) {
    user = await User.create({
      email,
      user_name,
      picture,
      oauth_provider,
    });
  }

  res.json({ user_id: user.id });
});

module.exports = { userAuth };

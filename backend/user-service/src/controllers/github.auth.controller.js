const asyncHandler = require("express-async-handler");
const axios = require("axios");

const getJWTtoken = asyncHandler(async (req, res) => {
  const response = await axios.post(
    "https://github.com/login/oauth/access_token",
    null,
    {
      params: {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: req.body.code,
        redirect_uri: process.env.GITHUB_REDIRECT_URI,
      },
      headers: {
        Accept: "application/json",
      },
    }
  );
  res.json({ id_token: response.data.access_token });
});

const getPayload = asyncHandler(async (req, res) => {
  const { id_token } = req.body;

  const userResponse = await axios.get("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${id_token}`,
    },
  });

  const emailResponse = await axios.get("https://api.github.com/user/emails", {
    headers: {
      Authorization: `Bearer ${id_token}`,
    },
  });

  const user = userResponse.data;
  const email = emailResponse.data[0].email;

  res.json({
    email,
    name: user.login,
    picture: user.avatar_url,
  });
});

module.exports = { getJWTtoken, getPayload };

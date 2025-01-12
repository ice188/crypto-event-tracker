const asyncHandler = require("express-async-handler");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "postmessage"
);

const getJWTtoken = asyncHandler(async (req, res) => {
  /* exchange google auth code for jwt token */
  const { tokens } = await client.getToken(req.body.code);
  const id_token = tokens.id_token;
  
  res.json({ id_token });
});

const getPayload = asyncHandler(async (req, res) => {
  /* get user info from token */
  const { id_token } = req.body;
  const ticket = await client.verifyIdToken({
    idToken: id_token,
    requiredAudience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();

  res.json({
    email: payload.email,
    name: payload.name,
    picture: payload.picture,
  });
});

module.exports = {
  getJWTtoken,
  getPayload,
};

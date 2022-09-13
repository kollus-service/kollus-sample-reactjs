const express = require("express");
const router = express.Router();

const constants = require("../../lib/constants");
const jwt = require("../../lib/jwt");

router.get("/", (req, res, next) => {
  let payload = {
    mc: [
      {
        mckey: req.query.mckey,
      },
    ],
    cuid: process.env.CLIENT_USER_ID,
    expt: Math.round(new Date().getTime() / 1000) + constants.EXPIRE_TIME,
  };

  let responseJWT = {
    jwt: jwt.sign(payload),
    customKey: process.env.CUSTOM_USER_KEY,
  };
  res.json(responseJWT);
});

module.exports = router;
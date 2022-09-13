const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const jwt = require("../../lib/jwt");
const constants = require("../../lib/constants");

dotenv.config();

router.post("/callback", (req, res, next) => {
  // console.log(req.body);
  let jsonData = JSON.parse(req.body.items);
  jsonData = jsonData[0];

  let kind = jsonData.kind;
  let mediaContentKey = jsonData.media_content_key;
  let sessionKey = jsonData.session_key;

  let currentTime = Math.round(new Date().getTime() / 1000);
  let addPayload;
  let result = 1;

  let expireTime =
    Math.round(new Date().getTime() / 1000) + constants.EXPIRE_TIME;

  switch (kind) {
    // Download Start
    case 1:
      if (expireTime < currentTime) {
        result = 0;
      }

      addPayload = {
        expiration_date: expireTime,
        result: result,
      };
      break;

    // Download Done
    case 2:
      break;

    // Play
    case 3:
      addPayload = {
        expiration_date: expireTime,
        content_expired: 0,
        content_expire_reset: 1,
        expiration_count: 5,
        session_key: sessionKey,
        result: result,
      };
      break;
  }

  let payload = {
    kind: kind,
    media_content_key: mediaContentKey,
    result: 1,
    ...addPayload,
  };

  res.set("X-Kollus-UserKey", process.env.CUSTOM_USER_KEY);
  let data = Array(payload);
  let responseJWT = jwt.sign({ data });
  res.send(responseJWT);
});

router.get("/refresh", (req, res, next) => {
  let expireTime = Math.round(new Date().getTime() / 1000) + constants.EXPIRE_TIME;

  res.status(200).json({
    message: "DRM refreshed!",
    new: expireTime,
    content_expired: 0,
    content_expire_reset: 1,
    expiration_count: 5,
  });
});

module.exports = router;

const express = require('express');
const router = express.Router();
const dotenv = require("dotenv");
const constants = require("../../lib/constants");

let expireTime = Math.round(new Date().getTime() / 1000) + constants.EXPIRE_TIME;
let contentExpired = 0;
let contentExpiredReset = 0;

dotenv.config();

router.post("/callback", (req, res, next) => {
  //console.log(req.body);
  let jsonData = JSON.parse(req.body.items);
  jsonData = jsonData[0];

  let kind = jsonData.kind;
  let mediaContentKey = jsonData.media_content_key;
  let sessionKey= jsonData.session_key;

  let currentTime = Math.round(new Date().getTime() / 1000);
  let addPayload;
  let result = 1;

  switch(kind) {
    // Download Start
    case 1 :
      if(expireTime < currentTime) {
        result = 0;
      }

      addPayload = {
        expiration_date : expireTime,
        result : result,
      };
      break;

    // Download Done
    case 2 :
      break;

    // Play
    case 3 :
      if(contentExpiredReset == 0 && expireTime < currentTime) {
        contentExpired = 1;
        result = 0;
      }

      addPayload = {
        expiration_date : expireTime,
        content_expired : contentExpired,
        content_expire_reset : contentExpiredReset,
        session_key : sessionKey,
        result : result,
      };

      //addPayload 에 들어가고 나면 다시 0으로 스위치 off
      if (contentExpiredReset == 1) contentExpiredReset = 0; 
      break;
  }

  let payload = {
    kind: kind,
    media_content_key: mediaContentKey,
    result: 1,
    ...addPayload,
  };

  res.set('X-Kollus-UserKey', process.env.CUSTOM_USER_KEY);
  let data = Array(payload);
  let responseJWT = jwt.sign({data});
  res.send(responseJWT);
});

router.get("/refresh", (req, res, next) => {
  let oldExpireTime = expireTime;
  expireTime = Math.round(new Date().getTime() / 1000) + constants.EXPIRE_TIME;
  contentExpired = 0;
  contentExpiredReset = 1;

  res.status(200).json({
    message:"DRM refreshed!",
    old: oldExpireTime,
    new: expireTime,
    content_expired : contentExpired,
    content_expire_reset : contentExpiredReset,
  });
});

module.exports = router;
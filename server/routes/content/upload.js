const express = require("express");
const router = express.Router();
const axios = require("axios");
const constants = require("../../lib/constants");
const FormData = require("form-data");

router.get("/url", async (req, res, next) => {
  let formData = new FormData();
  // is_encryption_upload : 0은 일반 업로드, 1은 암호화 업로드
  formData.append("is_encryption_upload", 1);
  formData.append("category_key", process.env.CATEGORY_KEY);

  const response = await axios.post(
    constants.KOLLUS_CREATE_UPLOAD_URL + "?access_token=" + process.env.ACCESS_TOKEN,
    formData,
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );

  res.json(response.data);
});

module.exports = router;
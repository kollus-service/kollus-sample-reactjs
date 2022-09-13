const express = require('express');
const router = express.Router();
const addContent = require("../../persistence/content/addContent");

router.post("/callback", async (req, res, next) => {
  addContent(req, res, next);
});

module.exports = router;
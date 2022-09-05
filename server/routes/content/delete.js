const express = require('express');
const router = express.Router();
const deleteContent = require("../../persistence/content/deleteContent");

router.post("/content/delete/callback", async (req, res, next) => {
  deleteContent(req, res, next);
});

module.exports = router;
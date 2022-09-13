const express = require('express');
const router = express.Router();
const updateContent = require("../../persistence/content/updateContent");

router.post("/callback", updateContent);

module.exports = router;
const express = require('express');
const router = express.Router();
const getContents = require("../../persistence/content/getContents");

router.get("/", getContents);

module.exports = router;
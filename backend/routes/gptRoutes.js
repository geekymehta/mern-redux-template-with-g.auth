const express = require("express");
const router = express.Router();
const { getGptAnswer } = require("../controllers/gptController");

router.post("/", getGptAnswer);

module.exports = router;

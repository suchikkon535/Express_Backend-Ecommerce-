const express = require("express")
const router = express.Router()
// const auth = require("../middleware/auth.middleware");

const { home } = require("../controllers/index.controller")

router.get("/", home)

module.exports = router
const express = require("express");
const router = express.Router();
const controller =  require("../controllers")
const middleware = require("../middlewares")

router.get("/profile", middleware.verifyAccessToken,controller.users.profile)

module.exports = router;
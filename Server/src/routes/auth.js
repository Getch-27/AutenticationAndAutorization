const express = require("express");
const router = express.Router();
const controller =  require("../controllers")

router.post("/signup", controller.auth.signup);
router.post("/login", controller.auth.login);
router.post("/refreshToken", controller.auth.newAccessToken);
//router.post("/refreshToken", controller.auth.newRefreshToken);

module.exports = router;

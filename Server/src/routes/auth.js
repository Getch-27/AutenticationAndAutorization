const express = require("express");
const router = express.Router();
const controller =  require("../controllers")

router.post("/signup", controller.auth.signup);
router.post("/login", controller.auth.login);
router.post("/refreshToken", controller.auth.newAccessToken);
router.get("/google/callback", controller.auth.googleCallback);

module.exports = router;
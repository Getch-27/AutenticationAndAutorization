const express = require('express');
const app = express();
const router = express.Router();
const authRouter = require("./auth")
const userRouter = require("./users")


router.use ('/auth' , authRouter);
router.use ('/users', userRouter)

module.exports = router;
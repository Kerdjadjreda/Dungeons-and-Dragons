const express = require("express");
const userRouter = express.Router();
const isConnected = require("../MIDDLEWARES/auth")
const userController = require("../CONTROLLERS/userController");


userRouter.post("/register", userController.register);
userRouter.post("/login", userController.login);
userRouter.get("/me", isConnected, userController.me);

/*userRouter.get("/test", (req, res) =>{
    res.json({ ok: true });
});*/

module.exports = userRouter;
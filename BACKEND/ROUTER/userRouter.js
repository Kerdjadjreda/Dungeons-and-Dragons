const express = require("express");
const userRouter = express.Router();

const userController = require("../CONTROLLERS/userController");
// console.log("ALLO ? TESTE ROUTE");

userRouter.post("/register", userController.register);

userRouter.get("/test", (req, res) =>{
    res.json({ ok: true });
});

module.exports = userRouter;
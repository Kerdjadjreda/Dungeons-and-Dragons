const express = require("express");
const campaignsRouter = express.Router();
const isConnected = require("../MIDDLEWARES/auth")
const campaignsController = require("../CONTROLLERS/campaignsController");

campaignsRouter.post('/', isConnected, campaignsController.createOne);
campaignsRouter.post('/join', isConnected, campaignsController.joinOne);


module.exports = campaignsRouter;
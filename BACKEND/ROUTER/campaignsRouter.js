const express = require("express");
const campaignsRouter = express.Router();
const isConnected = require("../MIDDLEWARES/auth")
const campaignsController = require("../CONTROLLERS/campaignsController");
const charactersController = require("../CONTROLLERS/charactersController");

campaignsRouter.post('/', isConnected, campaignsController.createOne);
campaignsRouter.post('/join', isConnected, campaignsController.joinOne);
campaignsRouter.post('/:campaignId/characters', isConnected, charactersController.createOne);

module.exports = campaignsRouter;
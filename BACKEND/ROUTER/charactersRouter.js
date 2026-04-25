const express = require('express');
const charactersRouter = express.Router();
const charactersController = require('../CONTROLLERS/charactersController');
const isConnected = require("../MIDDLEWARES/auth");
const isCharacterMember = require("../MIDDLEWARES/isCharacterMember");

charactersRouter.get('/me/:campaignId', isConnected, charactersController.getMyCharacter);
charactersRouter.get("/:characterId/items", isConnected, isCharacterMember, charactersController.getCharacterItems);
charactersRouter.post("/:characterId/items", isConnected, isCharacterMember, charactersController.addItems);
//charactersRouter.patch("/:characterId/items/:itemId", isConnected, isCharacterMember, charactersController);
//charactersRouter.delete("/:characterId/items/:itemId", isConnected, isCharacterMember, charactersController);


module.exports = charactersRouter;
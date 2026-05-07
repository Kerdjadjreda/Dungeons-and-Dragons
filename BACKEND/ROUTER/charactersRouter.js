const express = require('express');
const charactersRouter = express.Router();
const charactersController = require('../CONTROLLERS/charactersController');
const isConnected = require("../MIDDLEWARES/auth");
const isCharacterMember = require("../MIDDLEWARES/isCharacterMember");
const isCharOwnerOrGameMaster = require("../MIDDLEWARES/isCharOwnerOrGameMaster");
const isGameMaster = require("../MIDDLEWARES/isGameMaster");

charactersRouter.get('/me/:campaignId', isConnected, charactersController.getMyCharacter);
charactersRouter.get('/:characterId/campaigns/:campaignId', isConnected, isCharOwnerOrGameMaster, charactersController.getCharacterDetails);
//cette route me servira plus tard pour rafraichir uniquement les items apres modification plutot que de fetch getcharacterdetails.
charactersRouter.get("/:characterId/items", isConnected, isCharOwnerOrGameMaster, charactersController.getCharacterItems);
charactersRouter.post("/:characterId/campaigns/:campaignId/items", isConnected, isGameMaster, charactersController.addItems);
//charactersRouter.patch("/:characterId/items/:itemId", isConnected, isCharacterMember, charactersController);
//charactersRouter.delete("/:characterId/items/:itemId", isConnected, isCharacterMember, charactersController);


module.exports = charactersRouter;
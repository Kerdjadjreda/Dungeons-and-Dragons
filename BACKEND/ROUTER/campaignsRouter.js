const express = require("express");
const campaignsRouter = express.Router();
const isConnected = require("../MIDDLEWARES/auth")
const campaignsController = require("../CONTROLLERS/campaignsController");
const charactersController = require("../CONTROLLERS/charactersController");
const isCampaignMember = require("../MIDDLEWARES/isCampaignMember");
const isPlayerMember = require("../MIDDLEWARES/isPlayerMember");


campaignsRouter.get("/", isConnected, campaignsController.getUserCampaigns);
campaignsRouter.post('/', isConnected, campaignsController.createOne);
campaignsRouter.post('/join', isConnected, campaignsController.joinOne);

// J'ajoute un middleware "isPlayerMember" qui me permet de savoir
// 1- si l'utilisateur fait parti de la campagne,  2- le role de l'utilisateur.
campaignsRouter.post('/:campaignId/characters', isConnected, isPlayerMember, charactersController.createOne);
campaignsRouter.get("/:campaignId/characters", isConnected, isCampaignMember, charactersController.getAllCharacters);
campaignsRouter.get("/:campaignId/characters/me", isConnected, charactersController.getMyCharacter);





module.exports = campaignsRouter;
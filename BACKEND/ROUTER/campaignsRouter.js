const express = require("express");
const campaignsRouter = express.Router();
const isConnected = require("../MIDDLEWARES/auth")
const isCampaignMember = require("../MIDDLEWARES/isCampaignMember");
const isPlayerMember = require("../MIDDLEWARES/isPlayerMember");
const isGameMaster = require("../MIDDLEWARES/isGameMaster");
const checkIfPlayerHasChar = require('../MIDDLEWARES/checkIfPlayerHasChar');

const campaignsController = require("../CONTROLLERS/campaignsController");
const charactersController = require("../CONTROLLERS/charactersController");
const combatSessionsController = require("../CONTROLLERS/combatSessionsController")


campaignsRouter.get("/", isConnected, campaignsController.getUserCampaigns);
campaignsRouter.post('/', isConnected, campaignsController.createOne);
campaignsRouter.post('/join', isConnected, campaignsController.joinOne);
campaignsRouter.get('/:campaignId', isConnected, isCampaignMember, checkIfPlayerHasChar, campaignsController.getOne);
campaignsRouter.post('/:campaignId/combat-sessions', isConnected, isCampaignMember, isGameMaster, combatSessionsController.createOne);
// J'ajoute un middleware "isPlayerMember" qui me permet de savoir
// 1- si l'utilisateur fait parti de la campagne,  2- le role de l'utilisateur.
campaignsRouter.post('/:campaignId/characters', isConnected, isPlayerMember, charactersController.createOne);
campaignsRouter.get("/:campaignId/characters", isConnected, isCampaignMember, charactersController.getAllCharacters);
//campaignsRouter.get("/:campaignId/characters/me", isConnected, charactersController.getMyCharacter);





module.exports = campaignsRouter;
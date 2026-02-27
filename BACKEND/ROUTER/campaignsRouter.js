const express = require("express");
const campaignsRouter = express.Router();
const isConnected = require("../MIDDLEWARES/auth")
const campaignsController = require("../CONTROLLERS/campaignsController");
const charactersController = require("../CONTROLLERS/charactersController");
const isCampaignMember = require("../MIDDLEWARES/isCampaignMember");
const isPlayerMember = require("../MIDDLEWARES/isPlayerMember");


campaignsRouter.get("/", isConnected, campaignsController.getUserCampaigns);
campaignsRouter.get("/:campaignId/characters/me", isConnected, charactersController.getMyCharacter);
campaignsRouter.get("/:campaignId/characters", isConnected, isCampaignMember, charactersController.getAllCharacters);

campaignsRouter.post('/', isConnected, campaignsController.createOne);
campaignsRouter.post('/join', isConnected, campaignsController.joinOne);
// ici pour cette route je n'ai besoin que de isPlayerMember en middleware. car il fait deux check. 
// le premier: si l'utilisateur est membre et le 2eme si l'utilisateur est MJ
campaignsRouter.post('/:campaignId/characters', isConnected, isPlayerMember, charactersController.createOne);





module.exports = campaignsRouter;
const campaignsDataMapper = require("../DATAMAPPER/campaignsDataMapper.js")

const campaignsController = {

    async createOne(req, res) {
        const { camp_name, mode, synopsis } = req.body;
        // console.log("tesssssssst alloooooo", req.userId)
        try{
            const countCampaigns = await campaignsDataMapper.countCreatedCampaignByUser(req.userId);
            if(countCampaigns >= 2){
                return res.status(403).json({ error: "La limite de parties actives en tant que maitre du jeu a été atteint (2 max)."});
        }

            const newCampaign = await campaignsDataMapper.createOne({ 
                camp_name, 
                mode, 
                synopsis, 
                creatorUserId: req.userId });
                return res.status(201).json(newCampaign);
        } catch(error){ 
            console.log("ERREUR CREATION DE CAMPAGNE", error);
            return res.status(500).json({ error: error.message });
            }
    },

    async getOne(req, res){
        const userId = req.userId;
        const campaignId = req.params.campaignId;
        try{
            const campainResult = await campaignsDataMapper.findCampaignByPk(userId, campaignId);
            if(!campainResult.campaign){
                return res.status(404).json({ error: "Campagne est introuvable." })
            }
            const role = campainResult.campaign.role;
            const userCharacter = campainResult.characters.find(
                character => character.user_id === userId
            );

            if(role === "Joueur" && !userCharacter){
                return res.status(403).json({ error: "Vous devez d'abord créer un personnage." });
            }
            return res.status(200).json({ campaign: campainResult.campaign, characters: campainResult.characters, combatSessions: campainResult.combatSessions });
        } catch(error){
            console.error(error)
            return res.status(500).json({ error: "Erreur liée au serveur." });
        }
    },

    async deleteOne(req, res){

    },

    async joinOne(req, res) {
        const code = req.body.invite_code;
        const playerId = req.userId;

        try{
           const countCampaignsJoined = await campaignsDataMapper.countJoinedCampaignByUser(playerId);
            if(countCampaignsJoined >= 2){
                return res.status(403).json({ error: "La limite de parties actives en tant que joueur a été atteint (2 max)."})
            }
            const campaign = await campaignsDataMapper.findByInviteCode(code);

            if(!campaign) {
                return res.status(403).json( {error: "Code invalide ou campagne inexistante"});
            }
            const member = await campaignsDataMapper.addMember({ campaignId: campaign.id, playerId, role: "Joueur" });

            if(!member){
                return res.status(200).json({ 
                    campaignId: campaign.id, 
                    joined: false, 
                    alreadyMember: true,
                    message: "Ce joueur fait déjà parti de cette campagne."
                });
            }
            return res.status(200).json({ 
                campaignId: campaign.id, 
                joined: true, 
                member })

            
        } catch(error){
            if (error.message.includes("déjà membre")){
                return res.status(409).json({ error: error.message });
            }
            console.log("ERREUR INTERNE", error);
            return res.status(500).json({ error: "Erreur liée au serveur" });
        }
    },
    
    async getUserCampaigns(req, res) {
        const userId = req.userId;

        const campaignsList = await campaignsDataMapper.getAllCampaignsById(userId);
        return res.json({ campaignsList });
    },





}

module.exports = campaignsController;
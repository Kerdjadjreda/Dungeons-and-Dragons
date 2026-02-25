const campaignsDataMapper = require("../DATAMAPPER/campaignsDataMapper.js")

const campaignsController = {

    async createOne(req, res) {
        const { camp_name, mode, synopsis } = req.body;
        // console.log("tesssssssst alloooooo", req.userId)
        const countCampaigns = await campaignsDataMapper.countCreatedCampaignByUser(req.userId);
        if(countCampaigns >= 3){
            return res.status(403).json({ error: "Nombre maximum de campagnes atteint."});
        }

        try{
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

    async deleteOne(req, res){

    },

    async joinOne(req, res) {
        const code = req.body.invite_code;
        console.log(code);
        const playerId = req.userId;

        try{
            const campaign = await campaignsDataMapper.findByInviteCode(code);
            if(!campaign) {
                return res.status(404).json( {error: "Code invalide ou campagne inexistante"});
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





}

module.exports = campaignsController;
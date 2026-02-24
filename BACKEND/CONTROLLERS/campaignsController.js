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

    }





}

module.exports = campaignsController;
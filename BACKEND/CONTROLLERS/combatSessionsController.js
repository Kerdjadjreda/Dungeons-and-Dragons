const combatSessionsDataMapper = require("../DATAMAPPER/combatSessionsDataMapper");

const combatSessionsController = {

  async createOne(req, res){

    const campaignId = Number(req.params.campaignId);
    const title = req.body.title;
    

    try{
      const combatSession = await combatSessionsDataMapper.createOne(campaignId, title);
      return res.status(201).json({ combatSession });

    } catch(error){
      if(error.code === "23505"){
        return res.status(409).json({ error: "Une session de combat est déjà active pour cette campagne." });
      }
      console.error(error)
      return res.status(500).json({ error: "Erreur liée au serveur." });
    }

  },

  async findActiveSession(req, res){
    const campaignId = Number(req.params.campaignId);

    const activeSession = await combatSessionsDataMapper.findActiveSession(campaignId);
    return res.status(201).json({ activeSession });
    

  },

  async addCharacters(req, res){
    const combatSessionId = Number(req.params.combatSessionId);
    const campaignId = Number(req.combatSession.campaign_id);
    const { participants } = req.body;
    
    try{
      if(!Array.isArray(participants) || participants.length === 0){
        return res.status(400).json({ error: "Veuillez fournir une liste de participants." });
      }

    const instancedCharacters = await combatSessionsDataMapper.addCharacters(combatSessionId, campaignId, participants);
      return res.status(201).json({ instancedCharacters });

    }catch(error){
      if(error.code === '23505'){
        return res.status(409).json({ error: "Impossible d'ajouter deux fois le même personnage-joueur." });
      }
      console.error(error)
      return res.status(500).json({ error: "Erreur liée au serveur." });
    }
  }


    
  };


  module.exports = combatSessionsController;
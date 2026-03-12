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

  async findActiveSession(campaignId){

    const result = await pool.query(`SELECT id FROM combat_sessions WHERE campaign_id = $1 AND is_active = true`, [campaignId]);

    return result.rows[0];

  }
    
  };


  module.exports = combatSessionsController;
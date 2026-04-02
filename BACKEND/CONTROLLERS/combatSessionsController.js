const combatSessionsDataMapper = require("../DATAMAPPER/combatSessionsDataMapper");

const combatSessionsController = {

  async createOne(req, res){

    const campaignId = Number(req.params.campaignId);
    const title = req.body.title;
    

    try{
      const combatSession = await combatSessionsDataMapper.createOne(campaignId, title);
      return res.status(201).json(combatSession);

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
    console.log(combatSessionId)
    const campaignId = Number(req.combatSession.campaign_id);
    const { characters } = req.body;
  
    try{
      if(!Array.isArray(characters) || characters.length === 0){
        return res.status(400).json({ error: "Veuillez fournir une liste de participants." });
      }

    const instancedCharacters = await combatSessionsDataMapper.addCharacters(combatSessionId, campaignId, characters);
      return res.status(201).json({ instancedCharacters });

    }catch(error){
      if(error.code === '23505'){
        return res.status(409).json({ error: "Impossible d'ajouter deux fois le même personnage-joueur." });
      }
      console.error(error)
      return res.status(500).json({ error: "Erreur liée au serveur." });
    }
  },

  async addMonsters(req, res){
    const combatSessionId = Number(req.params.combatSessionId);
    const { monsters } = req.body;

    try{
      if(!Array.isArray(monsters) || monsters.length === 0){
        return res.status(400).json({ error: "Veuillez fournir un ou plusieurs monstres." });
      }
        const instancedMonsters = await combatSessionsDataMapper.addMonsters(combatSessionId, monsters);
        return res.status(201).json({ instancedMonsters });
    } catch(error){
      console.error(error)
      return res.status(500).json({ error: "Erreur liée au serveur." });
    }

  },

  async GetOneSessionCombat(req, res){

    const combatSessionId = Number(req.params.combatSessionId);
    try{
      const combatSession = await combatSessionsDataMapper.getSessionCombatByPk(combatSessionId);
      return res.status(201).json( combatSession );
    } catch(error){
      console.error(error)
      return res.status(500).json({ error: "Erreur liée au serveur" });
    }
  },

  async updateHpEntity(req, res){
    // je vais commencer par modifier simplement la vie des entités instancés au combat pour le MVP sinon je risque de me perdre dans la logique complexe d'un JDR.
    // je récupère l'id d'une session et l'id d'une entité via les params.
    const combatSessionId = Number(req.combatSession.id);
    const entityId = Number(req.params.entityId);
    const damages = Number(req.body.damages);

    try {
    if (!Number.isInteger(entityId) || entityId <= 0) {
      return res.status(400).json({ error: "ID d'entité invalide." });
    }

    if (!Number.isFinite(damages) || damages <= 0) {
      return res.status(400).json({ error: "Les dégâts doivent être un nombre positif." });
    }

    const result = await combatSessionsDataMapper.updateHpEntityByPk(
      entityId,
      combatSessionId,
      damages
    );

    if (!result) {
      return res.status(404).json({ error: "L'entité n'existe pas." });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erreur liée au serveur." });
  }

  }


    
  };


  module.exports = combatSessionsController;
const combatSessionsDataMapper = require("../DATAMAPPER/combatSessionsDataMapper");
const rollDice = require("../SERVICES/dices");

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

  },

  async attackEntity(req, res){
    const combatSessionId = Number(req.combatSession.id);
    const attackerId = Number(req.body.attackerId);
    const targetId = Number(req.body.targetId);
    const damageDice = Number(req.body.damageDice);
    const diceCount = Number(req.body.diceCount);

    try{
      if(!Number.isInteger(attackerId) || attackerId <= 0) {
        return res.status(400).json({ error: "L'attaquant est invalide."});
      }
      if(!Number.isInteger(targetId) || targetId <= 0) {
        return res.status(400).json({ error: "La cible est invalide."})
      }

      const allowedDice = [6, 8, 10, 12];
      if(!allowedDice.includes(damageDice)) {
        return res.status(400).json({ error: "Pas cool de tricher. Veuillez choisir parmis les dés fournis."})
      } if(!Number.isInteger(diceCount) || diceCount <=0 || diceCount > 10){
        return res.status(400).json({ error: "Nombre de dés invalide. Min 1 max 10."});
      }

      const dice20Result = rollDice(20);

      if(dice20Result === 1) {
        return res.status(200).json({
          success: false,
          roll: dice20Result,
          criticalFailure: true,
          message: "ÉCHEC CRITIQUE !"
        });
      }

      if (dice20Result < 10) {
        return res.status(200).json({
          success: false,
          roll: dice20Result,
          message: "L'attaque a échoué."
        });
      }

      const diceResults = [];
      let damages = 0;

      for(let i = 0; i <diceCount; i++){
        const rolls = rollDice(damageDice);
        diceResults.push(rolls);
        damages += rolls;
      }

      const updatedTarget = await combatSessionsDataMapper.updateHpEntityByPk(targetId, combatSessionId, damages);
      if (!updatedTarget) {
        return res.status(404).json({ error: "Cible introuvable dans cette session." });
      }

    if(updatedTarget.current_hp === 0) {
      return res.status(400).json({ error : "Vous ne pouvez pas attaquer cette cible." })
    }
      return res.status(200).json({
        success: true,
        roll: dice20Result,
        diceResults,
        damages,
        target: updatedTarget,
        message: `L'attaque touche et inflige ${damages} dégâts.`
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erreur liée au serveur." });
    }

  },
  async nextTurn(req, res){
    const combatSessionId = Number(req.combatSession.id);
    const currentPosition = Number(req.combatSession.current_position);

    try {
      const result = await combatSessionsDataMapper.nextTurn( combatSessionId, currentPosition);
      if (!result){
        return res.status(404).json({ error : "Il n'y a aucun personnage en vie dans cette session de combat."});
      };
      
      return res.status(200).json(result);
    } catch(error) {
      return res.status(500).json({ error: "erreur liée au serveur."});
    }
  },

  async endCombatSession(req, res) {
    const combatSessionId = Number(req.combatSession.id);

    try {
      const result = await combatSessionsDataMapper.endCombatSession(combatSessionId);

      if (!result) {
        return res.status(404).json({ error: "Session introuvable." });
      }

      return res.status(200).json({
        message: "Le combat est terminé.",
        combatSession: result
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erreur serveur." });
    }
  }
    
};


  module.exports = combatSessionsController;
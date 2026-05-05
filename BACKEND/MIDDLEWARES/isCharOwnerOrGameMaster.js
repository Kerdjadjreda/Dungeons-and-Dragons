const pool = require('../SERVICES/dbPool');

async function isCharOwnerOrGameMaster(req, res, next){

  const userId = Number(req.userId);
  const characterId = Number(req.params.characterId);
  const campaignId = Number(req.params.campaignId);

  try {
    const result = await pool.query(`SELECT c.*, cm.role
                               FROM characters c
                               JOIN campaign_members cm
                               ON cm.campaign_id = c.campaign_id
                               AND cm.user_id = $1
                               WHERE c.id =$2
                               AND c.campaign_id = $3`,
                            [userId, characterId, campaignId]);

    
    const character = result.rows[0];
    if (!character) {
      return res.status(404).json({ error: "Personnage introuvable" });
    }

    const isOwner = Number(character.user_id) === userId;
    const isGameMaster = character.role === "Maitre du jeu";

    if (!isOwner && !isGameMaster) {
      return res.status(403).json({ error: "Accès interdit" });
    }

    req.character = character;

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erreur serveur" });
  }

}

module.exports = isCharOwnerOrGameMaster;
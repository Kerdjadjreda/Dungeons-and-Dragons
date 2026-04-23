const pool = require("../SERVICES/dbPool");

// Je fais un middleware pour permettre au joueur en question de jouer son tour.

async function canActThisTurn(req, res, next) {
  const combatSessionId = Number(req.combatSession.id);
  const currentPosition = Number(req.combatSession.current_position);
  const campaignId = Number(req.combatSession.campaign_id);
  const userId = Number(req.userId);

  try {
    const activeEntityResult = await pool.query(
      `SELECT ie.*, c.user_id
       FROM instanced_entity ie
       LEFT JOIN characters c ON c.id = ie.character_id
       WHERE ie.combat_session_id = $1
         AND ie.position = $2
       LIMIT 1;`,
      [combatSessionId, currentPosition]
    );

    if (activeEntityResult.rowCount === 0) {
      return res.status(404).json({ error: "Aucune entité active trouvée." });
    }

    const activeEntity = activeEntityResult.rows[0];

    const roleResult = await pool.query(
      `SELECT role
       FROM campaign_members
       WHERE campaign_id = $1
         AND user_id = $2
       LIMIT 1;`,
      [campaignId, userId]
    );

    if (roleResult.rowCount === 0) {
      return res.status(403).json({ error: "Vous ne faites pas partie de cette campagne." });
    }

    const isGameMaster = roleResult.rows[0].role === "Maitre du jeu";

    if (activeEntity.entity_type === "monster") {
      if (!isGameMaster) {
        return res.status(403).json({
          error: "Seul le Maître du jeu peut jouer le tour des monstres."
        });
      }

      req.activeEntity = activeEntity;
      return next();
    }

    if (activeEntity.entity_type === "character") {
      if (Number(activeEntity.user_id) !== userId && !isGameMaster) {
        return res.status(403).json({
          error: "Ce n'est pas le tour de votre personnage."
        });
      }

      req.activeEntity = activeEntity;
      return next();
    }

    return res.status(403).json({ error: "Action non autorisée." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erreur serveur." });
  }
}

module.exports = canActThisTurn;
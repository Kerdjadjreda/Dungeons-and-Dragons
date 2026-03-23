const pool = require("../SERVICES/dbPool");

async function checkIfPlayerHasChar(req, res, next) {
  try {
    const userId = req.userId;
    const campaignId = Number(req.params.campaignId);

    // je récupère le role de l'utilisateur grace au middleware isCampaignMember.
    // Note à moi-même, ce middleware ne doit jamais être placé avant isCampaignMember sinon crash.
    const role = req.campaignMember.role;

    // Je bloque pas le game master
    if (role === "Maitre du jeu") {
      return next();
    }

    // Si c'est un joueur, il doit avoir un personnage
    if (role === "Joueur") {
      const result = await pool.query(
        `
        SELECT id, user_id, campaign_id, char_name
        FROM characters
        WHERE campaign_id = $1 AND user_id = $2
        LIMIT 1
        `,
        [campaignId, userId]
      );

      if (result.rowCount === 0) {
        return res.status(403).json({ error: "Vous devez créer un personnage avant d'accéder à cette campagne." });
      }

      req.character = result.rows[0];
      return next();
    }

    return res.status(403).json({
      error: "Accès refusé."
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erreur liée au serveur" });
  }
}

module.exports = checkIfPlayerHasChar;
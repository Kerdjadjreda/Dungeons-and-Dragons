const pool = require("../SERVICES/dbPool");

async function isCombatSessionMember(req, res, next) {
  try {
    const userId = req.userId;
    const campaignId = Number(req.combatSession.campaign_id);

    const checkMember = await pool.query(
      `SELECT 1
       FROM campaign_members
       WHERE user_id = $1
         AND campaign_id = $2`,
      [userId, campaignId]
    );

    if (checkMember.rowCount === 0) {
      return res.status(403).json({
        error: "Vous n'êtes pas membre de cette session de combat."
      });
    }

    return next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erreur liée au serveur" });
  }
}

module.exports = isCombatSessionMember;
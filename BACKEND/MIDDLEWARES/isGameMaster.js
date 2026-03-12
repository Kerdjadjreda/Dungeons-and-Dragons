const pool = require('../SERVICES/dbPool');

// Je me sers de la même structure que mon middleware isCampaignMember que je modifie légèrement pour voir si le joueur est MJ.
async function isGameMaster(req, res, next) {
  try {
    //je récupère l'id utilisateur et l'id de la campagne.
    const userId = req.userId;
    const campaignId = Number(req.params.campaignId);
    
    const result = await pool.query(
      "SELECT role FROM campaign_members WHERE campaign_id = $1 AND user_id = $2",
      [campaignId, userId]
    );

    if (result.rowCount === 0) {
      return res.status(403).json({ error: "Vous n'êtes pas membre de cette campagne." });
    } 
    if(!result.rows[0].role === "Maitre du jeu"){
      return res.status(403).json({ error: "Vous n'êtes pas autorisé à créer une session de combat."})
    }
    return next();

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erreur liée au serveur" });
  }
}

module.exports = isGameMaster;
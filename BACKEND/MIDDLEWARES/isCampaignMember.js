const pool = require("../SERVICES/dbPool");

// je crée un middleware pour vérifier si l'utilisateur fait parti de la campagne
async function isCampaignMember(req, res, next) {
  try {
    //je récupère l'id utilisateur et l'id de la campagne.
    const userId = req.userId;
    const campaignId = Number(req.params.campaignId);
    //je vérifie s'il y a une ligne correspondante aux valeurs que je passe.
    const result = await pool.query(
      "SELECT 1 FROM campaign_members WHERE campaign_id = $1 AND user_id = $2",
      [campaignId, userId]
    );
    // si aucune ligne m'est retournée, alors il n'est tout simplement pas membre de la campagne, donc je traite l'erreur.
    if (result.rowCount === 0) {
      return res.status(403).json({ error: "Vous n'êtes pas membre de cette campagne." });
    }
    // et si tout se passe bien, je passe la main au controller.
    return next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erreur liée au serveur" });
  }
}

module.exports = isCampaignMember;
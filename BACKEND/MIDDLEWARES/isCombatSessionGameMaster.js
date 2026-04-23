const pool = require("../SERVICES/dbPool");


const isCombatSessionGameMaster = async(req, res, next) =>{

    try{
        const userId = req.userId;
        // ici je récupère l'id de la campagne depuis req.combatSession et non pas depuis le params car je ne passe plus l'id dans l'url.
        const campaignId = Number(req.combatSession.campaign_id);

        const result = await pool.query(`SELECT role FROM campaign_members
                                         WHERE campaign_id = $1
                                         AND user_id = $2`, [campaignId, userId]);

        if(result.rowCount === 0){
            return res.status(403).json({ error: "Vous ne faites pas parti de cette campagne." });
        
        } if(result.rows[0].role !== "Maitre du jeu"){
            return res.status(403).json({ error: "Seul un maitre de jeu est autorisé à faire cela." });
        }
        
        return next();
    }catch(error){
        console.error(error)
        return res.status(500).json({ error: "Erreur liée au serveur." });
    }
}

module.exports = isCombatSessionGameMaster;
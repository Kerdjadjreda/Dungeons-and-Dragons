const pool = require("../SERVICES/dbPool");

const isPlayerMember = async (req, res, next) => {

        try {
            const userId = req.userId;
            const campaignId = Number(req.params.campaignId);

            const result = await pool.query(`
                SELECT role FROM campaign_members WHERE campaign_id = $1
                AND user_id = $2`, [campaignId, userId]);
                // je vérifie toujours s'il est membre ou non de la campagne.
            if (result.rowCount === 0){
                return res.status(403).json({ error: "Vous n'êtes pas membre de cette campagne" })
            }
            // J'empèche aux utilisateurs de créer un personnage s'ils ont créés la campagne. (Ils sont par définition MJ).
            const role = result.rows[0].role;
            if(role === "Maitre du jeu"){
                return res.status(403).json({ error: "Création d'un personnage impossible en tant que MJ." });
            }
            return next();
        } catch (error){
            console.error(error);
            return res.status(500).json({ error: "Erreur liée au serveur"});
        }

}
    
module.exports = isPlayerMember;
// J'ai besoin de ce middlware pour vérifier si l'utilisateur a accès au personnage.
// pour cela je dois m'assurer que l'utilisateur est membre de la camapgne dans laquelle ce personnage est.


const pool = require("../SERVICES/dbPool");

const isCharacterMember = async(req, res, next) =>{

    try {
        const userId = req.userId;
        
        const characterId = Number(req.params.characterId);
        
        const result = await pool.query(`SELECT c.id, c.user_id, cm.role
                                         FROM characters c
                                        JOIN campaign_members cm ON cm.campaign_id = c.campaign_id
                                        WHERE c.id = $1
                                        AND cm.user_id = $2`, [characterId, userId]);
        if (result.rowCount === 0){
            return res.status(403).json({ error : "L'accès à ce personnage vous est refusé."});
        }
        const characterOwner = Number(result.rows[0].user_id);
        const userRole = result.rows[0].role;
        const isOwner = characterOwner === userId;
        const isMJ = userRole === "Maitre du jeu";
        console.log("VISUELLLLLLLLLLLLLL", userRole)

        if (!isOwner && !isMJ){
            return res.status(403).json({ error : "L'accès à cet inventaire vous est refusé."})
        }

        return next();

    } catch (error){
        console.error(error);
        return res.status(500).json({ error: "erreur liée au serveur" });
    }

};

module.exports = isCharacterMember;
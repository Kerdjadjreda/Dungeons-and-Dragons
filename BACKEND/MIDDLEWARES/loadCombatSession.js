const pool = require("../SERVICES/dbPool");

// middleware pour vérifier si une session de combat existe. Si oui, je stock rans req.combatSession la ligne retournée.

const loadCombatSession = async(req, res, next) => {

    try{
        const combatSessionId = Number(req.params.combatSessionId);

        const result = await pool.query(`SELECT * FROM combat_sessions WHERE id = $1`, [combatSessionId]);
        if(result.rowCount === 0){
            return res.status(404).json({ error: "Aucune session de combat n'a été trouvée." });
        }

        req.combatSession = result.rows[0];
        return next();

    }catch(error){
        console.error(error);
        return res.status(500).json({ error: "Erreur liée au serveur. ICIII" });

    }

}

module.exports = loadCombatSession;
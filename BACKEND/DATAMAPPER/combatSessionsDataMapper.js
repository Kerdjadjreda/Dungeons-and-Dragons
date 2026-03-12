const pool = require("../SERVICES/dbPool");

const combatSessionsDataMapper = {
    async createOne(campaignId, title){

        const result = await pool.query(`INSERT INTO combat_sessions (campaign_id, title)
                              VALUES ($1,$2) RETURNING *`, 
                              [campaignId, title]);

            return result.rows[0];
        
    }

}

module.exports = combatSessionsDataMapper;
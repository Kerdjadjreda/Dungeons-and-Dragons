const pool = require("../SERVICES/dbPool");

const campaignsDataMapper = {

    async createOne({camp_name, mode, synopsis, creatorUserId}){
        const sqlQuery = `INSERT INTO campaigns (camp_name, mode, synopsis, creator_user_id)
                          VALUES ($1, $2, $3, $4)
                          RETURNING *;`;
        const values = [camp_name, mode, synopsis, creatorUserId];
        const result = await pool.query(sqlQuery, values);
        console.log("teeest", result.rows[0]);
        return result.rows[0];
    },

    async countCreatedCampaignByUser(userId){
        const result = await pool.query(`SELECT COUNT(*) FROM campaigns
                                        WHERE creator_user_id = $1`, [userId]);
        
        return Number(result.rows[0].count);
    }
}

module.exports = campaignsDataMapper;
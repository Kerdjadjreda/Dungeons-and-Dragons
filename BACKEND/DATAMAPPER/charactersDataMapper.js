const pool = require("../SERVICES/dbPool");

const charactersDataMapper = {

    async createCharacters(
            userId, 
            campaignId, 
            { char_name, 
            race, 
            char_class, 
            exp = 0, 
            hp, 
            mana = 0, 
            gold = 0, 
            strength, 
            constitution, 
            dexterity, 
            intelligence, 
            wisdom, 
            charisma }){

        const sqlQuery = `INSERT INTO characters
        (user_id, campaign_id, char_name, race, char_class, 
        exp, hp, mana, gold, strength, constitution, dexterity, 
        intelligence, wisdom, charisma) 
        VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9,
         $10, $11, $12, $13, $14, $15)
         RETURNING *;`;

         const charInfos = [userId, campaignId, char_name, race, char_class, 
        exp, hp, mana, gold, strength, constitution, dexterity, 
        intelligence, wisdom, charisma];

        const result = await pool.query(sqlQuery, charInfos);
        return result.rows[0];

    },

    async getMyCharacter(userId, campaignId){
            const result = await pool.query(`SELECT c.*, u.username 
                                             FROM characters c
                                             JOIN users u ON u.id = c.user_id
                                             WHERE c.user_id = $1
                                             AND c.campaign_id = $2`, [userId, campaignId]);
            return result.rows;


    },

    async getCharactersById(campaignId){
        const result = await pool.query(`SELECT c.id, c.char_name, c.race, c.char_class, u.username
                                        FROM characters c
                                        JOIN users u ON u.id = c.user_id
                                        WHERE c.campaign_id = $1
                                        AND c.is_dead = false`, [campaignId]);
        return result.rows;

    }

}


module.exports = charactersDataMapper;

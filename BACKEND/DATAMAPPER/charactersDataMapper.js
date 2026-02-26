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

    }

}


module.exports = charactersDataMapper;

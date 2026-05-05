const pool = require("../SERVICES/dbPool");

const charactersDataMapper = {

    async createOneCharacter(
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

    async getCharacterByIdAndCampaign(characterId, campaignId) {
        const result = await pool.query(
            `
            SELECT c.*, u.username
            FROM characters c
            JOIN users u ON u.id = c.user_id
            WHERE c.id = $1
            AND c.campaign_id = $2
            `,
            [characterId, campaignId]
        );

        return result.rows[0];
    },

    async getCharactersById(campaignId){
        const result = await pool.query(`SELECT c.id, c.char_name, c.race, c.char_class, u.username
                                        FROM characters c
                                        JOIN users u ON u.id = c.user_id
                                        WHERE c.campaign_id = $1
                                        AND c.is_dead = false`, [campaignId]);
        return result.rows;

    },

    // je récupère toutes les lignes de la table items et de la pivot characters_items
    async getItemListByCharacterId(characterId){
        const result = await pool.query(`SELECT i.id, i.item_name, i.effect_type, i.effect_value, ci.quantity, ci.is_equipped 
                                         FROM items i
                                         JOIN characters_items ci ON ci.item_id = i.id
                                         WHERE ci.character_id = $1`, [characterId]);
        return result.rows;
    },

    // methode pour insérer des objets. puisqu'elle passe par la table pivot, il me faut deux INSERT. et donc une transaction sql
    async addItemsByCharacterId(characterId, { 
        item_name, 
        item_description = null, 
        item_category, 
        effect_type = null, 
        effect_value = null,
        quantity = 1 }){

            const client = await pool.connect()
            try{
                await client.query("BEGIN");

                const insertItem = await client.query(`INSERT INTO items (item_name, item_description, item_category, effect_type, effect_value)
                    VALUES ($1,$2,$3,$4,$5) 
                    RETURNING items.id;`, 
                    [item_name, item_description, item_category, effect_type, effect_value]);

                const itemId = insertItem.rows[0].id;
                    
                await client.query(`INSERT INTO characters_items (character_id, item_id, quantity)
                        VALUES ($1, $2, $3)`, [characterId, itemId, quantity]);

                await client.query("COMMIT");

            } catch (error) {
                await client.query("ROLLBACK");
                throw error;
            } finally {
                client.release();
            }

    }

}


module.exports = charactersDataMapper;

const { addCharacters } = require("../CONTROLLERS/combatSessionsController");
const pool = require("../SERVICES/dbPool");

const combatSessionsDataMapper = {
    async createOne(campaignId, title){

        const result = await pool.query(`INSERT INTO combat_sessions (campaign_id, title)
                              VALUES ($1,$2) RETURNING *`, 
                              [campaignId, title]);

            return result.rows[0];
        
    },

    async findActiveSession(campaignId){

        await pool.query(`SELECT id FROM combat_sessions WHERE campaign_id = $1 AND is_active = true`, [campaignId]);
        return result.rows[0];
    },

    async addCharacters(combatSessionId, campaignId, participants ){

        // je vais devoir boucler sur chaque objet tu tableau "participants". il me faut donc une transaction sql car c'est une suite d'INSERT.
        // et il me faut là aussi réserver un pool de connexion pour respecter la transaction.
        const client = await pool.connect();

        try{
            await client.query('BEGIN');

            const addedCharacters = [];
            let position = 1;
            
            for(const participant of participants){
                const { characterId, initiative } = participant;
                
                const characterResult = await client.query(` SELECT id, char_name, hp FROM characters WHERE id = $1 AND campaign_id = $2`, [characterId, campaignId]);
                
                
                // si aucune ligne n'est retournée au moment de l'itération, c'est que le personnage n'existe pas. Donc je traite l'erreur par une condition.
                if(characterResult.rowCount === 0) {
                    throw new Error(`Le personnage ${characterId} n'existe pas dans cette campagne.`);
                }
                const character = characterResult.rows[0];
                const characterType = "character";

                const insertResult = await client.query(`INSERT INTO instanced_entity (combat_session_id, character_id, entity_type, hp_max, current_hp, initiative, position)
                                                         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
                                                        [combatSessionId, character.id, characterType, character.hp, character.hp, initiative, 0]);
                
                // j'ajoute chaque ligne dans le tableau que j'ai initié plus haut.
                addedCharacters.push(insertResult.rows[0]);
            }
            // A présent je dois donner un ordre aux joueurs via la colonne position. Pour l'instant je vais le faire via une boucle qui incrémente +1 à chaque tour.
            // plus tard ce système sera bien entendu plus complexe car je devrais prendre en compte l'initiative pour indiquer la position des personnages instancés.
            const entitiesResult = await client.query(`SELECT id, initiative FROM instanced_entity 
                                                            WHERE combat_session_id = $1
                                                            ORDER BY initiative DESC, id ASC`, [combatSessionId]);

            for(const entity of entitiesResult.rows){
                await client.query(`UPDATE instanced_entity
                                    SET position = $1
                                    WHERE id = $2`, [position, entity.id]);
                position++;
            }

            await client.query('COMMIT');
            return addedCharacters;
                
        } catch(error){
         await client.query('ROLLBACK');
         throw error;
        } finally {
            client.release();
        }
    }
};

module.exports = combatSessionsDataMapper;
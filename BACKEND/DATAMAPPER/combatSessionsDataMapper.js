//const { addCharacters, updateHpEntity } = require("../CONTROLLERS/combatSessionsController");
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
    },

    async addMonsters(combatSessionId, monsters) {
        const client = await pool.connect();

        try {
            await client.query("BEGIN");

            const addedMonsters = [];

            for (const monster of monsters) {
                const { monsterTemplateId, quantity, initiative } = monster;

                const monsterResult = await client.query(
                 `SELECT
                  id,
                  monster_name,
                  (stat_block ->> 'hit_points')::int AS hp_max
                  FROM monster_templates
                  WHERE id = $1`,
                  [monsterTemplateId]
                );

                if (monsterResult.rowCount === 0) {
                    throw new Error(`Le monstre ${monsterTemplateId} n'existe pas.`);
                }

                const monsterTemplate = monsterResult.rows[0];

                for(let i = 0; i< quantity; i++){
                    const insertResult = await client.query(
                        `INSERT INTO instanced_entity (
                        combat_session_id,
                        monster_template_id,
                        entity_type,
                        hp_max,
                        current_hp,
                        initiative,
                        position,
                        is_dead
                        )
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                        RETURNING *`,
                        [
                            combatSessionId,
                            monsterTemplate.id,
                            "monster",
                            monsterTemplate.hp_max,
                            monsterTemplate.hp_max,
                            initiative,
                            0,
                            false
                        ]
                    );
                    addedMonsters.push(insertResult.rows[0]);
                }
            }

            const entitiesResult = await client.query(
                `SELECT id, initiative
                FROM instanced_entity
                WHERE combat_session_id = $1
                ORDER BY initiative DESC, id ASC`,
                [combatSessionId]
            );

            let position = 1;

            for (const entity of entitiesResult.rows) {
                await client.query(
                `UPDATE instanced_entity
                SET position = $1
                WHERE id = $2`,
                [position, entity.id]
                );
                position++;
            }

            await client.query("COMMIT");
            return addedMonsters;
        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
    },

    async getSessionCombatByPk(combatSessionId){

        const combatSession = await pool.query(`SELECT * FROM combat_sessions WHERE id =$1`, [combatSessionId]);

        const result = await pool.query(`SELECT
                                            ie.id,
                                            ie.combat_session_id,
                                            ie.entity_type,
                                            ie.character_id,
                                            ie.monster_template_id,
                                            ie.current_hp,
                                            ie.hp_max,
                                            ie.initiative,
                                            ie.position,
                                            ie.is_dead,
                                            ie.gold_delta,
                                            ie.exp_delta,

                                            c.char_name,
                                            c.char_class,

                                            mt.monster_name,
                                            mt.monster_type

                                            FROM instanced_entity ie
                                            LEFT JOIN characters c
                                            ON c.id = ie.character_id
                                            LEFT JOIN monster_templates mt
                                            ON mt.id = ie.monster_template_id
                                            WHERE ie.combat_session_id = $1
                                            ORDER BY ie.position ASC;`, [combatSessionId]);

        return { combatSession: combatSession.rows[0],
                 instancesEntities: result.rows
        };

    },
    async updateHpEntityByPk(entityId, combatSessionId, damages){
        const result = await pool.query(`UPDATE instanced_entity
                                            SET current_hp = GREATEST(0, current_hp - $1),
                                            is_dead = (current_hp - $1) <= 0
                                            WHERE combat_session_id = $2
                                            AND id = $3
                                            RETURNING *;`,[damages, combatSessionId, entityId]);
        return result.rows[0];

    },

    async nextTurn(combatSessionId, currentPosition){
        // Cette methode du dataMapper permet de passer au tour de la prochaine entité vivante dans une session de combat
        // je commence par récupérer toutes les entités en vie d'une session de combat
        const entitiesResult = await pool.query(`SELECT id, position, is_dead
                                                 FROM instanced_entity
                                                 WHERE combat_session_id = $1
                                                 AND is_dead = false
                                                 ORDER BY position ASC`, [combatSessionId]);
        const aliveEntites = entitiesResult.rows;
        if(aliveEntites.lenfth === 0){
            return null;
        }
        // je range dans une variable le prochain joueur. je le prends via la première valeur plus élevée que la position du joueur actuel.
        let nextEntity = aliveEntites.find(entity => Number(entity.position) > currentPosition);
        let roundIncrement = 0;

        if (!nextEntity){
            // Si je n'ai pas de valeur plus élevée, je repasse à la première valeur du tableau et je rajoute +1 au tour.
            nextEntity = aliveEntites[0];
            roundIncrement = 1;
        }
        // et pour finir j'actualise la session de combat par son id. Current position prend la valeur du prochain à jouer, j'incrémente mon tour si besoin.
        const updateResult = await pool.query(`UPDATE combat_sessions
                                               SET current_position = $1,
                                               round_number = round_number + $2
                                               WHERE id = $3
                                               RETURNING *`, [nextEntity.position, roundIncrement, combatSessionId]);
        return { 
            combatSession: updateResult.rows[0],
            activeEntity: nextEntity
        };
    },
    async endCombatSession(combatSessionId) {
        const result = await pool.query(
            `UPDATE combat_sessions
            SET is_active = false,
                ended_at = NOW()
            WHERE id = $1
            RETURNING *`,
            [combatSessionId]
        );

        return result.rows[0];
    }

};

module.exports = combatSessionsDataMapper;
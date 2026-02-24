const pool = require("../SERVICES/dbPool");

const campaignsDataMapper = {

    async createOne({ camp_name, mode, synopsis, creatorUserId }){
        // je résèrve un pool de connexion pour la transaction à venir.
        const client = await pool.connect();
        const role2 = "Maitre du jeu";
        try {
            await client.query("BEGIN");
            // cette requete me permet via les infos de créer une campagne
            const insertCampaign = await client.query(
                `INSERT INTO campaigns (camp_name, mode, synopsis, creator_user_id)
                 VALUES ($1, $2, $3, $4)
                 RETURNING *;`,
                 [camp_name, mode, synopsis, creatorUserId]
                );
            const campaign = insertCampaign.rows[0];
            
            // et là je dois ajouter les informations dans la table pivot

            await client.query(
                `INSERT INTO campaign_members (campaign_id, user_id, role, joined_at)
                VALUES ($1, $2, $3, NOW())`,
                [campaign.id, creatorUserId, role2]
            );
            // je termine la transaction avec commit
            await client.query("COMMIT");
            return campaign;
            // en cas d'erreur, j'annule la transaction tout en récupérant l'erreur
        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
            // et je relache la pool de connexion que j'ai alloué pour la transaction
        } finally {
            await client.release();
        }

    },

    async countCreatedCampaignByUser(userId){
        const result = await pool.query(`SELECT COUNT(*) FROM campaigns
                                        WHERE creator_user_id = $1`, [userId]);
        
        return Number(result.rows[0].count);
    }
}

module.exports = campaignsDataMapper;
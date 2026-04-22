const pool = require("../SERVICES/dbPool");
const generateInviteCode = require("../UTILS/codeGenerator.js");

const campaignsDataMapper = {
  async createOne({ camp_name, mode, synopsis, creatorUserId }) {
    // je résèrve un pool de connexion pour la transaction à venir.
    const role2 = "Maitre du jeu";
    const maxAttempts = 5;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const client = await pool.connect();
      const code = generateInviteCode();

      try {
        await client.query("BEGIN");
        // cette requete me permet via les infos de créer une campagne
        const insertCampaign = await client.query(
          `INSERT INTO campaigns (camp_name, mode, synopsis, creator_user_id, invite_code)
                     VALUES ($1, $2, $3, $4, $5)
                     RETURNING *;`,
          [camp_name, mode, synopsis, creatorUserId, code],
        );
        const campaign = insertCampaign.rows[0];

        // et là je dois ajouter les informations dans la table pivot

        await client.query(
          `INSERT INTO campaign_members (campaign_id, user_id, role, joined_at)
                    VALUES ($1, $2, $3, NOW())`,
          [campaign.id, creatorUserId, role2],
        );
        // je termine la transaction avec commit
        await client.query("COMMIT");
        return campaign;
        // en cas d'erreur, j'annule la transaction tout en récupérant l'erreur
      } catch (error) {
        await client.query("ROLLBACK");
        if (error.code === "23505") {
          continue;
        }
        throw error;
        // et je relache la pool de connexion que j'ai alloué pour la transaction
      } finally {
        client.release();
      }
    }
    throw new Error(
      "Erreur lors de la génération du code d'invitation. Veuillez essayez à nouveau",
    );
  },

  async countCreatedCampaignByUser(userId) {
    const result = await pool.query(
      `SELECT COUNT(*) AS total_created FROM campaigns
       WHERE creator_user_id = $1`,
      [userId],
    );

    return Number(result.rows[0].total_created);
  },

  async countJoinedCampaignByUser(playerId){
    const result = await pool.query(`SELECT COUNT(*) AS total_joined FROM campaign_members
                                     WHERE user_id =$1 AND role= 'Joueur'`, [playerId]);
    return Number(result.rows[0].total_joined);
  },

  async findByInviteCode(code) {
    const result = await pool.query(
      `SELECT id FROM campaigns WHERE invite_code = $1;`,
      [code],
    );
    return result.rows[0];
  },

  async addMember({ campaignId, playerId, role }) {
    const result = await pool.query(
      `INSERT INTO campaign_members (campaign_id, user_id, role, joined_at)
       VALUES ($1, $2, $3, NOW()) 
       ON CONFLICT (campaign_id, user_id) DO NOTHING 
       RETURNING*;`,
      [campaignId, playerId, role],
    );
    return result.rows[0];
  },

  async getAllCampaignsById(userId) {
    const result = await pool.query(
      `SELECT id, camp_name, mode, synopsis, created_at, cm.role, cm.joined_at
       FROM campaigns 
       JOIN campaign_members cm ON cm.campaign_id = campaigns.id
       WHERE cm.user_id=$1
       ORDER BY campaigns.created_at DESC`,
      [userId],
    );
    return result.rows;
  },

  async findCampaignByPk(userId, campaignId) {
    const campaignResult = await pool.query(
      `SELECT c.*, cm.joined_at, cm.role
      FROM campaigns c
      JOIN campaign_members cm ON cm.campaign_id = c.id
      WHERE cm.user_id = $1 AND c.id = $2`,
      [userId, campaignId]
    );

    const charactersResult = await pool.query(
      `SELECT *
      FROM characters
      WHERE campaign_id = $1`,
      [campaignId]
    );

    const combatSessionResult = await pool.query(
    `SELECT *
     FROM combat_sessions
     WHERE campaign_id = $1
     AND is_visible = true
     ORDER BY started_at DESC`,
    [campaignId]
  );

    return {
      campaign: campaignResult.rows[0],
      characters: charactersResult.rows,
      combatSessions: combatSessionResult.rows,
    };
  }

};

module.exports = campaignsDataMapper;

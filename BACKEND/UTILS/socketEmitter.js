// REFACTO: pour éviter de me répéter dans toutes les méthodes des controllers, je me crée ce petit fichier.

function emitCampaignUpdated(req, campaignId) {
  const io = req.app.get("io");
  if (!io) return;

  io.to(`campaign-${campaignId}`).emit("campaign_updated", {
    campaignId,
  });
}

function emitCombatUpdated(req, campaignId, combatSessionId) {
  const io = req.app.get("io");
  if (!io) return;

  io.to(`campaign-${campaignId}`).emit("combat_updated", {
    campaignId,
    combatSessionId,
  });
}

module.exports = {
  emitCampaignUpdated,
  emitCombatUpdated,
};
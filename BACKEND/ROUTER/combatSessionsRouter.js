const express = require("express");
const combatSessionsRouter = express.Router();
const isConnected = require("../MIDDLEWARES/auth")
const loadCombatSession = require("../MIDDLEWARES/loadCombatSession");
const isCombatSessionGameMaster = require("../MIDDLEWARES/isCombatSessionGameMaster");
const isCombatSessionMember = require("../MIDDLEWARES/isCombatSessionMember");
const combatSessionsController = require("../CONTROLLERS/combatSessionsController");


// il me faut un middleware pour charger les infos d'une session de combat et un autre qui ne laisse que le GM modifier une session de combat.

combatSessionsRouter.post('/:combatSessionId/characters', isConnected, loadCombatSession, isCombatSessionGameMaster, combatSessionsController.addCharacters)
combatSessionsRouter.post('/:combatSessionId/monsters', isConnected, loadCombatSession, isCombatSessionGameMaster, combatSessionsController.addMonsters)
combatSessionsRouter.post('/:combatSessionId/attack', isConnected, loadCombatSession, isCombatSessionGameMaster, combatSessionsController.attackEntity)
combatSessionsRouter.get('/:combatSessionId', isConnected, loadCombatSession, isCombatSessionMember, combatSessionsController.GetOneSessionCombat)
combatSessionsRouter.patch('/:combatSessionId/entities/:entityId/take-damage', isConnected, loadCombatSession, isCombatSessionGameMaster, combatSessionsController.updateHpEntity)
combatSessionsRouter.patch('/:combatSessionId/next-turn', isConnected, loadCombatSession, isCombatSessionGameMaster, combatSessionsController.nextTurn);
combatSessionsRouter.patch('/:combatSessionId/end', isConnected, loadCombatSession, isCombatSessionGameMaster, combatSessionsController.endCombatSession);
combatSessionsRouter.patch('/:combatSessionId/close-tab', isConnected, loadCombatSession, isCombatSessionGameMaster, combatSessionsController.closeCombatTab);

module.exports = combatSessionsRouter;
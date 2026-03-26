const express = require('express');
const monstersRouter = express.Router();

const monstersController = require('../CONTROLLERS/monstersController');



 monstersRouter.get('/', monstersController.getAllMonsters);
 monstersRouter.get('/:monsterId',monstersController.getOneMonster);

module.exports = monstersRouter;
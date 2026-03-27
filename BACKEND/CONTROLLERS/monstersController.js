const monstersDataMapper = require('../DATAMAPPER/monstersDataMapper');


const monstersController = {
    async getAllMonsters(req, res) {
        try{
            const monsters = await monstersDataMapper.findAll();
            return res.status(200).json({ monsters });
        }catch(error){
            console.error(error)
            return res.status(500).json({ error: "erreur liée au serveur." });
        }
    },

    async getOneMonster(req, res) {
            const monsterId = Number(req.params.monsterId)
        try{
            const monster = await monstersDataMapper.findByPk();
            return res.status(200).json({ monster });
        } catch(error){
            console.error(error)
        }
    }

}

module.exports = monstersController;
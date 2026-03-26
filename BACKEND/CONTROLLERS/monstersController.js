const monstersDataMapper = require('../DATAMAPPER/monstersDataMapper');


const monstersController = {
    async getAllMonsters(req, res) {
        try{
            const response = await monstersDataMapper.findAll();
            return res.status(200).json({ response });
        }catch(error){
            console.error(error)
            return res.status(500).json({ error: "erreur liée au serveur." });
        }
    },

    async getOneMonster(req, res) {
            const monsterId = req.params.monsterId
        try{
            const response = await monstersDataMapper.findByPk();
            return res.status(200).json({ response });
        } catch(error){
            console.error(error)
        }
    }

}

module.exports = monstersController;
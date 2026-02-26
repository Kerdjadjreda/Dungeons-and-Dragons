const charactersDataMapper = require('../DATAMAPPER/charactersDataMapper.js');


const charactersController = {

    async createOne(req, res){
        const userId = req.userId;
        const campaignId = Number(req.params.campaignId);

        const { char_name, 
            race, 
            char_class, 
            exp, 
            hp, 
            mana, 
            gold, 
            strength, 
            constitution, 
            dexterity, 
            intelligence, 
            wisdom, 
            charisma } = req.body;
        try{
            const character = await charactersDataMapper.createCharacters(
                userId, 
                campaignId, 
                { char_name, 
                race, 
                char_class, 
                exp, 
                hp, 
                mana, 
                gold, 
                strength, 
                constitution, 
                dexterity, 
                intelligence, 
                wisdom, 
                charisma });

              return res.status(201).json({ character });
            } catch(error){
                if (error.code === "23503"){
                    return res.status(403).json({ error: "Vous n'êtes pas membre de cette campagne" });
                } 
                if (error.code === "23505") {
                    return res.status(409).json({ error: "Le nom du personnage existe déjà" });
                }
                console.error(error);
                return res.status(500).json( { error: "Erreur liée au serveur" });
            }
        

    }
}


module.exports = charactersController;

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
                //je gère l'erreur s'il y a violation de la contrainte de mes index
                if (error.code === "23505") {
                    if (error.constraint === "uniq_alive_character_per_user_per_campaign"){
                        return res.status(409).json({ error: "Vous avez déjà un personnage actif dans cette campagne." })

                    }if (error.constraint === "uniq_alive_char_name_per_campaign"){
                    return res.status(409).json({ error: "Le nom du personnage existe déjà" });
                    }
                }
                // et ici je gère l'erreur s'il y a violation de la contrainte UNIQUE de la composite
                if (error.code === "23503"){
                    return res.status(403).json({ error: "Vous n'êtes pas membre de cette campagne" });
                } 
                console.error(error);
                return res.status(500).json( { error: "Erreur liée au serveur" });
            }
        
    },

    async getMyCharacter(req, res){
        const userId = req.userId;
        const campaignId = Number(req.params.campaignId);

        try{
            const myCharacters = await charactersDataMapper.getMyCharacter(userId, campaignId);
        // si je n'ai aucun personnage je renvoi une erreur.
            if(!myCharacters.length === 0){
                return res.status(404).json({ error: "Aucun personnage n'a été trouvé"});
        }
            return res.status(200).json({ myCharacters });
        } catch(error){
            console.error(error);
            return res.status(500).json ({ error: "Erreur liée au serveur" });
        }

    },

    async getAllCharacters(req, res){
        const campaignId = Number(req.params.campaignId);

        try{
            const characters = await charactersDataMapper.getCharactersById(campaignId);
            return res.status(200).json({ characters });
            
        } catch(error){
            console.error(error)
            return res.status(500).json({error: "Erreur liée au serveur"});
        }
        
    }
}


module.exports = charactersController;

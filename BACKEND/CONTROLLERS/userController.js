const userDatamapper = require("../DATAMAPPER/userDataMapper")

const userController = {

    async register(req, res)  {
        //Je récupère les informations du body
        const { email, username, password } = req.body;
        console.log(email);
        
        // j'appelle ensuite le dataMapper pour lui envoyer les informations et créer un utilisateur
        const newUser = await userDatamapper.createOne({
            email,
            username,
            password
        });

        // et je revoi la réponse
        res.status(201).json(newUser);

    }
};

module.exports = userController;
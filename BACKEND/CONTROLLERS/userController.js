const userDatamapper = require("../DATAMAPPER/userDataMapper")
const bcrypt = require("bcrypt");
const saltRounds = 10;

const userController = {

    async register(req, res)  {
        //Je récupère les informations du body
        const { email, username, password } = req.body;
        console.log(email);
        
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        // j'appelle ensuite le dataMapper pour lui envoyer les informations et créer un utilisateur
        const newUser = await userDatamapper.createOne({
            email,
            username,
            hashedPassword
        });

        // et je revoi la réponse
        res.status(201).json(newUser);

    }
};

module.exports = userController;
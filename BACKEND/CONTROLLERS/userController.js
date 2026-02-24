const userDatamapper = require("../DATAMAPPER/userDataMapper")
const bcrypt = require("bcrypt");
const { signToken } = require("../UTILS/jwt")

const saltRounds = 10;

const userController = {

    async register(req, res)  {
        //Je récupère les informations du body
        const { email, username, password } = req.body;
        
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        // j'appelle ensuite le dataMapper pour lui envoyer les informations et créer un utilisateur
        const newUser = await userDatamapper.createOne({
            email,
            username,
            hashedPassword
        });

        // et je revoi la réponse
        res.status(201).json(newUser);

    },

    async login(req, res) {
        const { username, password }= req.body;
        //Je demande au datamapper de me retourner l'utilisateur par son username via la methode findByUsername
        const user = await userDatamapper.findByUsername(username);
        //Je récupère ensuite le mot de passe hash en BDD que je vais comparer avec celui du body
        const match = await bcrypt.compare(password, user.password);
        /*Si ça match, alors je renvois un status 201 avec les informations au format json.*/
        if(match){
            // il faut que je puisse générer et renvoyer un jwt avec l'id et le username si ça match
            const payload = { userId: user.id, username: user.username };
            const token = signToken(payload);
            return res.json({ 
                token, 
                user: { userId: user.id, username: user.username } });
        }
        return res.status(401).json({ error: "Pseudo ou mot de passe incorrect" })
    },

    async me (req, res) {
        // console.log(req.userId)
        const user = await userDatamapper.findById(req.userId);
        res.json(user);
    }

};

module.exports = userController;
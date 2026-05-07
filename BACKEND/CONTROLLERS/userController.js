const userDatamapper = require("../DATAMAPPER/userDataMapper")
const bcrypt = require("bcrypt");
const { signToken } = require("../UTILS/jwt")

const saltRounds = 10;

const userController = {

    async register(req, res) {
        const { email, username, password } = req.body;

        try {
            if (!email || !username || !password) {
            return res.status(400).json({ error: "Tous les champs sont requis." });
            }

            const passwordRegex = /^(?=.*\d)(?=.*[^A-Za-z0-9]).{11,}$/;

            if (!passwordRegex.test(password)) {
            return res.status(400).json({
                error:
                "Le mot de passe doit contenir au moins 11 caractères, un chiffre et un caractère spécial.",
            });
            }

            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const newUser = await userDatamapper.createOne({
            email,
            username,
            hashedPassword,
            });

            return res.status(201).json({
            user: newUser,
            message: "Compte créé avec succès.",
            });
        } catch (error) {
            console.error(error);

            if (error.code === "23505") {
            return res.status(409).json({
                error: "Cet email ou ce nom d'utilisateur est déjà utilisé.",
            });
            }

            return res.status(500).json({ error: "Erreur serveur." });
        }
    },

    async login(req, res) {
        try{
            
            const { username, password } = req.body;
            if(!username){
                return res.status(400).json({ error: "Veuillez entrez votre pseudo." })
            } else if(!password){
                return res.status(400).json({ error: "Veuillez entrer votre mot de passe." })
            }
            //Je demande au datamapper de me retourner l'utilisateur par son username via la methode findByUsername
            const user = await userDatamapper.findByUsername(username);

            if(!user){
                return res.status(401).json({ error: "Identifiants incorrects." })
            }
            //Je récupère ensuite le mot de passe hash en BDD que je vais comparer avec celui du body
            const match = await bcrypt.compare(password, user.password);
            /*Si ça match, alors je renvois un status 201 avec les informations au format json.*/
            if(match){
                // il faut que je puisse générer et renvoyer un jwt avec l'id et le username si ça match
                const payload = { userId: user.id, username: user.username };
                const token = signToken(payload);
                res.cookie("token", token, {
                    httpOnly: true,
                    secure: false, //Vue que je ne suis pas en HTTS, je ne sais pas s'il est a false par défaut donc dans le doute...
                    sameSite: "lax",
                    maxAge: 1000 * 60 * 60 * 24,
                })
                return res.json({  
                    user: { userId: user.id, username: user.username } });

            } else{
                return res.status(401).json({ error: "Mot de passe incorrect." });
            }
        } catch(error){
            console.error(error)
            return res.status(500).json({ error: "Erreur liée au serveur." });
        }
    },

    async me (req, res) {
        // console.log(req.userId)
        try{
            const token = req.cookies.token;
            if(!token){
                return res.status(401).json({ error: "Aucune authentification." });
            }
            const user = await userDatamapper.findById(req.userId);
            res.json(user);

        }catch(error){
            console.error(error)
                return res.status(500).json({ error: "Erreur liée au serveur." });
            
        }
    }

};

module.exports = userController;
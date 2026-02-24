const { verifyToken } = require("../UTILS/jwt.js");

//je crée mon middleware d'authentification
const isConnected = (req, res, next) => {
    
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return res.status(401).json({ error: "Aucun token n'a été envoyé" });
    };

    // Je split bearer" "monTokenIci et je récupère la 2eme valeur (donc mon token)
    const token = authHeader.split(" ")[1];

    try{
        const checked = verifyToken(token);
        req.userId = Number(checked.userId);
        
        next();
    } catch (error) {
        return res.status(401).json({ error: "Token invalide ou expiré" });
    }

};

module.exports = isConnected;
const { verifyToken } = require("../UTILS/jwt.js");

//je crée mon middleware d'authentification (V2, je le modifie pour me laisser une possibilité, plus tard d'avoir une app client mobile).
const isConnected = (req, res, next) => {
   // j'initialise mon token à nul. car il pourra être de deux sortes. soit dans l'authorization des headers soit dans les cookies httpOnly.
    let token = null;

    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith("Bearer ")) {
        // Je split bearer" "monTokenIci et je récupère la 2eme valeur (donc mon token)
        token = authHeader.split(" ")[1];
    };

    // ici je vérifie. s'il n'y a pas de authorization mais qu'il y a un token dans les cookie httpOnly, alors mon auth se servira de celui ci.
    if(!token && req.cookies && req.cookies.token){
        token = req.cookies.token;
    }
    
    if(!token){
        return res.status(401).json({ error: "Aucun token n'a été envoyé" });
    }

    try{
        const checked = verifyToken(token);
        req.userId = Number(checked.userId);
        
        next();
    } catch (error) {
        return res.status(401).json({ error: "Token invalide ou expiré" });
    }

};

module.exports = isConnected;
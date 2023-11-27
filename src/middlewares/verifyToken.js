//verifier le Token
const jwt = require('jsonwebtoken');
const colors = require('colors');

module.exports = (req, res, next) => {
    // const token = req.header('auth-token');
    console.log(colors.cyan('Vérification du token...'))
    const token = req.token;
    // console.log(colors.cyan('Token : ' + token))
    if (!token) return res.status(401).json({ Erreur: 'Accès refusé' });

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        console.log(colors.cyan('Token validé !'))
        next();
    } catch (error) {
        res.status(401).json({ Erreur: 'Token invalide' });
    }
}



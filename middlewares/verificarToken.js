const env = process.env.NODE_ENV || 'development';
const config = (env === 'development' || env === 'test') ? require(__dirname + '/../config/config.json')[env] : process.env;
const jwt = require('jsonwebtoken');

const SECRET_KEY = config.SEED;

const authenticateToken = (req, res, next) => {
    const token = req.get('token');
    if (token == null) return res.sendStatus(401); 
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.sendStatus(403); 
        req.usuario = decoded.usuario;
        next();
    });
};

module.exports = authenticateToken;

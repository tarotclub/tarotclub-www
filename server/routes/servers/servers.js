const router = require('express').Router();

let list = new Map();

function addServer(token, server) {
    list[token] = server;
}

function serversToJson() {
    return [...list];
}

router.post('/register', (req, res) => {

    
    if (req.body.token == process.env.TCDS_OFFICIAL_TOKEN1) {
        addServer(req.body.token, req.body.server); // server object contains only public information
    } else {
        // Serveur non officiel
        // TODO: il doit avoir été créé avant par un utilisateur valide
    }
    
});


router.get('/list', (req, res) => {

    res.status(200).json({
        success: true,
        data: serversToJson(),
        message: 'Servers list'
    });
    
});

module.exports = router;
const router = require('express').Router();

const JwtUtil = require("../jwtutil.js");

let list = new Map();
let sskList = new Map();

function addServer(token, server, ssk) {
    list[token] = server;
    sskList[token] = ssk;
}

function serversToJson() {
    return [...list];
}

router.post('/register', (req, res) => {

    let allowedToAddServer = false;
    if (req.body.token == process.env.TCDS_OFFICIAL_TOKEN1) {
        
        allowedToAddServer = true;
    } else {
        // Serveur non officiel
        // TODO: il doit avoir été créé avant par un utilisateur valide
    }

    if (allowedToAddServer)
    {
        let ssk = JwtUtil.genRandomString(16);
        addServer(req.body.token, req.body.server); // server object contains only public information
        console.log("[Servers] Added new server");
        res.status(200).json({
            success: true,
            data: {
                ssk: ssk
            },
            message: 'Servers list'
        });
    }
    else {
        res.status(200).json({
            success: false,
            data: {},
            message: 'Cannot add server'
        });
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
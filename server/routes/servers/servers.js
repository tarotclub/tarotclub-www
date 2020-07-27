const router = require('express').Router();

const JwtUtil = require("../jwtutil.js");

let list = new Map();
let sskList = new Map();


router.post('/register', (req, res) => {

    let token = req.body.token;
    let server = req.body.server;
    let allowedServer = false;

    if (req.body.token == process.env.TCDS_OFFICIAL_TOKEN1) {
        allowedServer = true;
    } else {
        // Serveur non officiel
        // TODO: il doit avoir été créé avant par un utilisateur valide
    }

    if (allowedServer)
    {
        if (req.body.command == 'register') {
            let ssk = JwtUtil.genRandomString(16);           
            // server object contains only public information, keep token and ssk private!
            list[token] = server;
            sskList[token] = ssk;

            console.log("[Servers] Added new server");
            res.status(200).json({
                success: true,
                data: {
                    ssk: ssk
                },
                message: 'Servers list'
            });
        } else {
            // Update status
            list[token] = server;
        }
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
        data: [...list],
        message: 'Servers list'
    });
    
});

module.exports = router;
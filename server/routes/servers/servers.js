const router = require('express').Router();
const jwt = require('jsonwebtoken');
const JwtUtil = require("../jwtutil.js");

let list = new Map();
let sskList = new Map();


let clients = [];

router.get('/events', JwtUtil.checkTokenForServers, (req, res, next) => {

    res.set({
        'Cache-Control': 'no-cache',
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no',
        "Access-Control-Allow-Origin": '*'
      });

      //=> Flush headers immediately
    // This has the advantage to 'test' the connection: if the client can't access this resource because of
    // CORS restrictions, the connection will fail instantly.
      res.flushHeaders();

    // After client opens connection send all nests as string

    

    // let interValID = setInterval(() => {
    //     counter++;
    //     // if (counter >= 10) {
    //     //     clearInterval(interValID);
    //     //     res.end(); // terminates SSE session
    //     //     return;
    //     // }
    //     res.write(`data: ${JSON.stringify({num: counter})}\n\n`); // res.write() instead of res.send()
    // }, 1000);
    
    const clientId = Date.now();
    const timerId = setInterval(() => {
                // Emit an SSE that contains the current 'count' as a string
                sendEventsToOneServer("Allow player", { payer: "plop" }, clientId);
            }, 1000);

    const newClient = {
      id: clientId,
      res,
      timerId: timerId
    };
    console.log("[SSE] New connection: " + clientId);

    clients.push(newClient);

    // When client closes connection we update the clients list
    // avoiding the disconnected one
    res.on('close', () => {
       console.log("[SSE] Connection closed: " + clientId);
       clearInterval(timerId);
       clients = clients.filter(c => c.id !== clientId);
      
    });
});

function sendEventsToOneServer(message, data, clientId) {
    clients.forEach((c) => {
        if (c.id == clientId) {
            c.res.write(JSON.stringify({
                success: true,
                data: data,
                message: message
            }));
        }
    });
}

// Iterate clients list and use write res object method to send new nest
function sendEventsToAll(message) {
    clients.forEach(c => c.res.write(JSON.stringify({
            success: true,
            data: { },
            message: message
        }))
    );
}


router.post('/status', JwtUtil.checkTokenForServers, (req, res, next) => {
    // Update status
    let token = req.body.token;
    let server = req.body.server;
    server.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    let allowedServer = false;

  //  sendEventsToAll("coucou");

    if (req.body.token == process.env.TCDS_OFFICIAL_TOKEN1) {
        allowedServer = true;
    } else {
        // Serveur non officiel
        // TODO: il doit avoir été créé avant par un utilisateur valide
    }

    if (allowedServer) {
        list.set(token, server);
        res.status(200).json({
            success: true,
            data: {},
            message: 'Status updated'
        });
    } else {
        res.status(200).json({
            success: false,
            data: {},
            message: 'Status update forbidden'
        });
    }
});


router.post('/register', (req, res) => {

    let token = req.body.token;
    let server = req.body.server;
    let allowedServer = false;

  //  sendEventsToAll("coucou");

    if (req.body.token == process.env.TCDS_OFFICIAL_TOKEN1) {
        allowedServer = true;
    } else {
        // Serveur non officiel
        // TODO: il doit avoir été créé avant par un utilisateur valide
    }

    if (allowedServer)
    {

        let ssk = JwtUtil.genRandomString(16);

        // Create JWT
        const serverObj = {
            token: token,
            name: server.name
        };

        // server object contains only public information, keep token and ssk private!
        list.set(token, server);
        sskList.set(token, ssk);

        jwt.sign ({server: serverObj}, process.env.JWT_SERVER_SECRET, (err, ssk) => {

            if (err) {
                res.status(200).json({
                    success: false,
                    data: {},
                    message: '[SERVERS] Error, cannot sign'
                });
            } else {
                console.log("[SERVERS] Added new server");
                res.status(200).json({
                    success: true,
                    data: {
                        ssk: ssk,
                    },
                    message: 'Server registered'
                });
            }
        });
    } else {
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
        data: Array.from(list).map( ([k,v]) => {return v} ),
        message: 'Servers list'
    });
    
});

module.exports = router;
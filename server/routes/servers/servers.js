const router = require('express').Router();

const JwtUtil = require("../jwtutil.js");

let list = new Map();
let sskList = new Map();


let clients = [];

router.get('/events', (req, res, next) => {

    // Mandatory headers and http status to keep connection open
    const headers = {
      'Content-Type': 'text/event-stream',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache'
    };

    res.set({
        'Cache-Control': 'no-cache',
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no',
        'Access-Control-Allow-Origin': '*'
      });
 //   res.flushHeaders();
    // res.writeHead(200, headers);
    // After client opens connection send all nests as string

    // res.json({
    //     success: true,
    //     data: {
    //         connected: true
    //     },
    //     message: 'SSE registering'
    // });
    // Generate an id based on timestamp and save res
    // object of client connection on clients list
    // Later we'll iterate it and send updates to each client
    const clientId = Date.now();
    const newClient = {
      id: clientId,
      res
    };
    console.log("[SSE] New connection: " + clientId);

    clients.push(newClient);
    let count = 0;

  //  while (true) {
    setInterval(() => {

            console.log('Emit', ++count);
            // Emit an SSE that contains the current 'count' as a string
            res.write('data: ' + count + '\n\n');

        }, 1000);
  
        
 //     }

    // When client closes connection we update the clients list
    // avoiding the disconnected one
    req.on('close', () => {
       console.log("[SSE] Connection closed: " + clientId);
      clients = clients.filter(c => c.id !== clientId);
    });
});

// Iterate clients list and use write res object method to send new nest
function sendEventsToAll(message) {
    clients.forEach(c => c.res.write(JSON.stringify({
            success: true,
            data: { },
            message: message
        }))
    );
}

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
        if (req.body.command == 'register') {
            let ssk = JwtUtil.genRandomString(16);           
            // server object contains only public information, keep token and ssk private!
            list.set(token, server);
            sskList.set(token, ssk);

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
            list.set(token, server);
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
        data: Array.from(list).map( ([k,v]) => {return v} ),
        message: 'Servers list'
    });
    
});

module.exports = router;
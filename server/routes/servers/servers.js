const router = require('express').Router();
const jwt = require('jsonwebtoken');
const JwtUtil = require("../jwtutil.js");
const WebSocket = require('ws');

let list = new Map();
let sskList = new Map();

let tarotServers = [];

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
    
    const tarotServerId = Date.now();
    const timerId = setInterval(() => {
                // Emit an SSE that contains the current 'count' as a string
                sendEventsToOneServer("Allow player", { payer: "plop" }, tarotServerId);
            }, 1000);

    const newClient = {
      id: tarotServerId,
      res,
      timerId: timerId
    };
    console.log("[SSE] New connection: " + tarotServerId);

    tarotServers.push(newClient);

    // When client closes connection we update the tarotServers list
    // avoiding the disconnected one
    res.on('close', () => {
       console.log("[SSE] Connection closed: " + tarotServerId);
       clearInterval(timerId);
       tarotServers = tarotServers.filter(c => c.id !== tarotServerId);
      
    });
});

function sendEventsToOneServer(message, data, tarotServerId) {
    tarotServers.forEach((c) => {
        if (c.id == tarotServerId) {
            c.res.write(JSON.stringify({
                success: true,
                data: data,
                message: message
            }));
        }
    });
}

// Iterate tarotServers list and use write res object method to send new nest
function sendEventsToAll(message) {
    tarotServers.forEach(c => c.res.write(JSON.stringify({
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

        // On envoie à tous les clients connectés la liste des serveurs
        sendToAllClients(getServerList());

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

    if (allowedServer) {

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

                // On envoie à tous les clients connectés la liste des serveurs
                sendToAllClients(getServerList());

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

// router.get('/list', (req, res) => {

//     res.status(200).json({
//         success: true,
//         data: Array.from(list).map( ([k,v]) => {return v} ),
//         message: 'Servers list'
//     });
    
// });

 
const wss = new WebSocket.Server({ port: 6000 });

function noop() {}
function getServerList()
{
    return JSON.stringify({
        data: Array.from(list).map( ([k,v]) => {return v} ),
        command: 'serverList'
    });
}

wss.on('connection', function connection(ws) {

    console.log('[WS] Client connected');

    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });

    ws.isAlive = true;
    ws.on('pong', function heartbeat() {
        this.isAlive = true;
    });

    ws.send(getServerList());

});

function sendToAllClients(data) {
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
}

const wsPingInterval = setInterval(function ping() {
    wss.tarotServers.forEach(function each(ws) {
        if (ws.isAlive === false) return ws.terminate();

        ws.isAlive = false;
        ws.ping(noop);
    });
}, 30000);

wss.on('close', function close() {
    clearInterval(wsPingInterval);
});

module.exports = router;

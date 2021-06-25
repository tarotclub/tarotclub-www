const router = require('express').Router();
const jwtUtil = require("../jwtutil.js");
const WebSocket = require('../websocket.js');

let list = new Map(); // liste des serveurs

// ================================================================================================
// LINK WITH TCDS TAROTCLUB SERVER EXECUTABLES
// ================================================================================================
const wss = new WebSocket();

wss.start("127.0.0.1", 8989, (cmd, client) => {

    // récupérer remote adresse lors du protocol upgrade, pour obtenir l'en-tête http x-forwarded-for
   // server.ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    try {
        let json = JSON.parse(cmd);

        if (list.has(json.token)) {
            updateServerStatus(token, server);
        } else {
            registerNewServer(json.token, json.server);
        }

    } catch (error) {
        
    }
    
    //wss.webSocketWrite(JSON.stringify({success: true}));
});

wss.onConnect = (newClient) => {
    console.log("Connected client ID: " + newClient.id);
};

function registerNewServer (token, server)
{
    let allowedServer = false;
    let success = false;

    if (token == process.env.TCDS_OFFICIAL_TOKEN1) {
        allowedServer = true;
    } else {
        // Serveur non officiel
        // TODO: il doit avoir été créé avant par un utilisateur valide
        allowedServer = true;
    }

    if (allowedServer) {
        // server object contains only public information, keep token and ssk private!
        list.set(token, server);
        console.log("[SERVERS] Added new server: " + JSON.stringify(server));

        success = true;
    }
    return success;   
}

function updateServerStatus(token, server)
{
    // Update status
    let allowedServer = false;

    console.log("[TCDS] Received status from server");
    if (req.body.token == process.env.TCDS_OFFICIAL_TOKEN1) {
        allowedServer = true;
    } else {
        // Serveur non officiel
        // TODO: il doit avoir été créé avant par un utilisateur valide
        allowedServer = true;
    }

    if (allowedServer) {
        list.set(token, server);
    }
}

// ================================================================================================
// PUBLIC ACCESS TO LIST OF SERVERS (client web, Qt, console ...)
// ================================================================================================
let publicListeners = [];


function mapToArray()
{
    return Array.from(list).map( ([k,v]) => {return v} );
}

router.get('/list', (req, res) => {
    res.status(200).json({
            success: true,
            data: mapToArray(),
            message: 'Servers list'
    });
});

router.post('/join', jwtUtil.checkTokenAllUsers, (req, res, next) => {
    console.log("[SERVERS] Join request to: " + JSON.stringify(req.body.server));

});


router.get('/events', (req, res, next) => {

    res.set({
        'Cache-Control': 'no-cache',
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Connection': 'keep-alive',
        'Transfer-Encoding': 'identity',
        'X-Accel-Buffering': 'no',
        "Access-Control-Allow-Origin": '*'
      });

/*
res.writeHead(200, {
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Transfer-Encoding': 'identity',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  })
*/
      res.socket.setKeepAlive(true);
      res.socket.setNoDelay(true);
      res.socket.setTimeout(0);

      //=> Flush headers immediately
    // This has the advantage to 'test' the connection: if the client can't access this resource because of
    // CORS restrictions, the connection will fail instantly.
      res.flushHeaders();
      res.write(':ok\n\n')

    // After client opens connection send all nests as string  

    const listenerId = Date.now();
    const newListener = {
      id: listenerId,
      res,
    };
    console.log("[SSE] New connection: " + listenerId);

    publicListeners.push(newListener);

    // When client closes connection we update the publicListeners list
    // avoiding the disconnected one
    res.on('close', () => {
       console.log("[SSE] Connection closed: " + listenerId);
       publicListeners = publicListeners.filter(c => c.id !== listenerId);
      
    });
});

const periodicPublicTimer = setInterval(function () {
    sendEventsToAll('servers', mapToArray())
}, 500);

// Iterate publicListeners list and use write res object method to send new nest
function sendEventsToAll(event, data) {
    publicListeners.forEach( (c) => {
        let message = "event: " + event + "\ndata: " + JSON.stringify(data) + "\n\n";
        console.log("Send event to: " + c.id + "message: " + message);
        c.res.write(message);
    });
}

module.exports = router;

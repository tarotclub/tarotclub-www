
/**
 * -1 = compte désactivé
 * 0 = compte non validé
 * 1 = exploitant
 * 2 = maintenance
 * 100 = admin 
 */

function isAdmin(level) {
    return (level >= 100) || (level === 2);
}

function ownerLevel() {
    return 1;
}

function isOwner(level) {
    return level == 1;
}

function isGod(username) {
   return username === process.env.ADMIN_USERNAME;
}

// id is the database machine id
function generateDevEui(machineId) {
    const buf = Buffer.alloc(8);
    buf[0] = 0xfb;
    buf[1] = 0xd5;
    buf[2] = 0xa8;
    buf[3] = 0x68;

    buf.writeUInt32BE(machineId, 4);
    return buf;
}

function getAppEui() {
    const buf = Buffer.alloc(8);
    buf[0] = 0x84;
    buf[1] = 0xae;
    buf[2] = 0xdb;
    buf[3] = 0xea;
    buf[4] = 0x55;
    buf[5] = 0x31;
    buf[6] = 0x04;
    buf[7] = 0x20;
    return buf;
}

// eui: buffer
// return integer
function extractMachineId(eui) {
    const temp = Buffer.alloc(4);
    temp[0] = 0;
    temp[1] = eui[5];
    temp[2] = eui[6];
    temp[3] = eui[7];
    return temp.readUInt32BE(0);
}

module.exports = {
    isAdmin,
    ownerLevel,
    isOwner,
    isGod,
    extractMachineId,
    generateDevEui,
    getAppEui
}

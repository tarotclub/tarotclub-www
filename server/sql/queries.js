
const initOptions = {
    capSQL: true // generate capitalized SQL 
  };
  

const pgp = require('pg-promise')(initOptions);
const connectionString = 'postgres://' + process.env.PGUSER + 
                    ':' + process.env.PGPASSWORD + 
                    '@' + process.env.PGHOST + 
                    ':' + process.env.PGPORT + 
                    '/' + process.env.PGDATABASE;

console.log("Database connection string: " + connectionString);

const db = pgp(connectionString);

async function createUser(username, hashed_password, level) {
    return  db.one('INSERT INTO users (username, password, level, login_attempts) VALUES(?, ?, ?, 0)', 
                [username, hashed_password, level]);
}

async function getUserByUsername(username) {
    return  db.any('SELECT * FROM users WHERE username=?', [username]);
}

async function updateProfile(firstname, lastname, company, email, tel, level, username) {
    return db.one('UPDATE users SET firstname=?, lastname=?, company=?, email=?, tel=?, level=? WHERE username=?',
                [firstname, lastname, company, email, tel, level, username]);
}

async function updateMyProfile(firstname, lastname, company, email, tel, username) {
    return db.one('UPDATE users SET firstname=?, lastname=?, company=?, email=?, tel=? WHERE username=?',
    [firstname, lastname, company, email, tel, username]);
}

async function getUsers() {
    return  db.any('SELECT username, firstname, lastname, company, email, tel, level, created, state FROM users');
}

async function deleteUser(username) {
    return db.one('UPDATE users SET state=0 WHERE username = ?', [username]);
}

async function setResetToken (id, token) {
    return db.one('UPDATE users SET reset_token=?, reset_password_datetime=DATE_ADD(NOW(), INTERVAL 15 MINUTE) WHERE id = ?', [token, id]);
}

async function getUserByResetToken(token) {
    return  db.any('SELECT * FROM users WHERE reset_token=?', [token]);
}

async function setNewPassword(id, hashed_password) {
    return db.one('UPDATE users SET password=?, reset_token=? WHERE id=?',
                [hashed_password, '', id]);
}


// =====================================================================================
// UPGRADE DATABASE
// =====================================================================================
async function upgradeDB() {
    
    let infos = await db.any('SELECT version FROM infos');
    // database always return an array
    
    if (infos.length === 0) {
        // Version 1.0.0
        // Modification du 01/06/2020: on ajoute un champs 'state' à toutes les tables dont on peut supprimer des lignes
        // state = 0 : ligne supprimée
        // state = 1 : ligne valide
        // await db.one('ALTER TABLE machines ADD COLUMN state INT DEFAULT 1');
        // await db.one('ALTER TABLE users ADD COLUMN state INT DEFAULT 1');
        // await db.one("INSERT INTO infos (version) VALUES(?)", ['1.1.0']);
        // console.log("[DB] Upgraded to version 1.1.0");
    }
    // next version: check version with: infos[0].version, length muste be equal to 1

}

module.exports = {
    createUser,
    getUserByUsername,
    updateProfile,
    getUsers,
    deleteUser,
    updateMyProfile,
    setResetToken,
    getUserByResetToken,
    setNewPassword,

    // Autres, maintenance ou fonctions plus globales
    upgradeDB
}

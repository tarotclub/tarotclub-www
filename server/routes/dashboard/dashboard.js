const router = require('express').Router();
const jwtutil = require('../jwtutil.js');

let user_root         = require('./user.js');

router.use( '/user', jwtutil.checkTokenAllUsers, user_root);

module.exports = router;

let express = require('express');
let router = express.Router();
import {topRank} from "../utils/database";

router.get('/', function(req, res) {
    res.sendFile(process.cwd()  + '/views/index.html');
});

router.get('/users', async function(req, res) {
    let dbtUsers=[];
    let topUsers =  await topRank();
    topUsers.forEach(function (user) {
        dbtUsers.push([user.tName,user.rating]); // adds their info to the dbUsers value
    });
    res.send(dbtUsers);
});

router.get('/fancy_users', async function(req, res) {
    let dbtUsers=[];
    let topUsers =  await topRank();
    topUsers.forEach(function (user) {
        dbtUsers.push({
            name :   user.tName,
            rating : user.rating
        });
    });
    res.send(dbtUsers);
});




module.exports = router;
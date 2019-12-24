import models from './models';
models.sequelize.sync();


// Setup requests to redirect to the index page
import express from 'express'
import dotenv from 'dotenv'
import 'babel-polyfill'
dotenv.config();
let app = express();
import router from './routers/router'
// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.use('/', router);

// Start our server


// Define configuration options
const opts = {
    identity: {
        username: process.env.BOT_USERNAME,
        password: process.env.OAUTH_TOKEN
    },
    channels: [
        process.env.CHANNEL_NAME
    ]
};
let client;
// Create a client with our options
import tmi from 'tmi.js';
if(process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== undefined) {

// listen for requests :)
    let listener = app.listen(process.env.PORT, function () {
        console.log('Your app is listening on port ' + listener.address().port);
    });
    client = new tmi.client(opts);

// Register our event handlers (defined below)
    client.on('message', onMessageHandler);
    client.on('connected', onConnectedHandler);

// Connect to Twitch:
    client.connect();
}

const koth_bot = 'smash4fefweubot';
import {handle_command} from './utils/helpers';
// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
    if (self) { return; }

    const usr = context.username;
    const command = msg.split(' ');
    // console.log(command,context, usr);
    // console.log("**********");
    if(command[0].startsWith('!')){

        const mod = (context.mod || usr === 'alexjett' || usr.toLowerCase() === 't5ace');
        handle_command(command[0].substr(1), command.slice(1), target, client, mod, usr);
    }
}



function onConnectedHandler (addr, port) {
    client.say(process.env.CHANNEL_NAME, 'I have just been restarted for some reason. ' +
        'if there were players in the queue, they need to be re added.')
    console.log(`* Connected to ${addr}:${port}`);
}


/*
t5Ace: !lose
'ModeratorSmash4UBot' : The King falls! @skylexifox is the new King! @zynders is the next challenger. Please let @t5ace know that you are ready.
t5ACE: !win
ModeratorSmash4UBot : The King wins! @t5ace is victorious and remains King! @skylexifox is the next challenger. Please let @t5ace know that you are ready.
 */
const tmi = require('tmi.js');
// init project
var express = require('express');
var Sequelize = require('sequelize');
var EloRank = require('elo-rank');
var elo = new EloRank();
var app = express();
// default user list
var users = [
      ["John","Hancock"],
      ["Liz","Smith"],
      ["Ahmed","Khan"]
    ];
var tusers = [
  ["alexjett", 1500],
  ["jettelobt", 1400],
  ["jettelobt2", 1200]
];
var User;
var tUser;
// setup a new database
// using database credentials set in .env
var sequelize = new Sequelize('database', process.env.DB_USER, process.env.DB_PASS, {
  host: '0.0.0.0',
  dialect: 'sqlite',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
    // Security note: the database is saved to the file `database.sqlite` on the local filesystem. It's deliberately placed in the `.data` directory
    // which doesn't get copied if someone remixes the project.
  storage: '.data/database.sqlite'
});

// authenticate with the database
sequelize.authenticate()
  .then(function(err) {
    console.log('Connection has been established successfully.');
    // define a new table 'users'
    User = sequelize.define('users', {
      firstName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      }
    });
    tUser = sequelize.define('tusers', {
      tName: {
        type: Sequelize.STRING
      },
      rating: {
        type: Sequelize.INTEGER
      }
    });
    setup();
  })
  .catch(function (err) {
    console.log('Unable to connect to the database: ', err);
  });

// populate table with default users
function setup(){
  User.sync({force: true}) // We use 'force: true' in this example to drop the table users if it already exists, and create a new one. You'll most likely want to remove this setting in your own apps
    .then(function(){
      // Add the default users to the database
      for(var i=0; i<users.length; i++){ // loop through all users
        User.create({ firstName: users[i][0], lastName: users[i][1]}); // create a new entry in the users table
      }
    });
  tUser.sync({force: true}) // We use 'force: true' in this example to drop the table users if it already exists, and create a new one. You'll most likely want to remove this setting in your own apps
  .then(function(){
    // Add the default users to the database
    for(var i=0; i<tusers.length; i++){ // loop through all users
      tUser.create({ tName: tusers[i][0], rating: tusers[i][1]}); // create a new entry in the users table
    }
  });
}

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/users", function (request, response) {
  var dbUsers=[];
  User.findAll().then(function(users) { // find all entries in the users tables
    users.forEach(function(user) {
      dbUsers.push([user.firstName,user.lastName]); // adds their info to the dbUsers value
    });
    response.send(dbUsers); // sends dbUsers back to the page
  });
});

app.get("/tusers", function (request, response) {
  var dbtUsers=[];
  tUser.findAll().then(function(tusers) { // find all entries in the users tables
    tusers.forEach(function(tuser) {
      dbtUsers.push([tuser.tName,tuser.rating]); // adds their info to the dbUsers value
    });
    dbtUsers.sort(function(a,b){
        return b[1] - a[1];
    });
    response.send(dbtUsers); // sends dbUsers back to the page
  });
});

// creates a new entry in the users table with the submitted values
app.post("/users", function (request, response) {
  User.create({ firstName: request.query.fName, lastName: request.query.lName});
  response.sendStatus(200);
});

// drops the table users if it already exists, populates new users table it with just the default users.
app.get("/reset", function (request, response) {
  setup();
  response.redirect("/");
});

// removes all entries from the users table
app.get("/clear", function (request, response) {
  User.destroy({where: {}});
  tUser.destroy({where: {}});
  response.redirect("/");
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
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

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot
  const command = msg.split(' ');
  console.log(command);
  console.log("**********");
  // Remove whitespace from chat message
  const commandName = msg.trim();

  // If the command is known, let's execute it
  if (commandName === '!d20') {
    const num = rollDice(commandName);
    client.say(target, `You rolled a ${num}. Link: https://glitch.com/~twitch-chatbot`);
    console.log(`* Executed ${commandName} command`);
  }
  
    // If the command is known, let's execute it
  else if (command[0] == `!add` && command.length == 2) {
    checkTuser(command[1]);
    addTuser(command[1]);
    client.say(target, `You added ${command[1]}`);
  }
  else if (command[0] == `!check` && command.length == 2){
    checkTuser(command[1]).then(function(exists){
      client.say(target, `You checked ${command[1]} and ${exists}`);
    });
  }
  else if (command[0] == `!update` && command.length == 3){
    var tname = command[1];
    var rating = parseInt(command[2]);
    updateTuser(tname,rating).then(function(response){
          client.say(target, response);
        });
    
  }
  else if (command[0] == `!match` && command.length == 3){
    match()
  }
   else {
    console.log(`* Unknown command ${commandName}`);
  }
}



async function checkTuser(tname){
  return tUser.count({ where: {tName: tname}})
   .then(count => {
    if(count != 0) {
      return true;
    }
    addTuser(tname);
    return false;
  });
}

async function updateTuser(tname, rating){
  try {
    let check = await checkTuser(tname);
    await tUser.update({ rating: rating }, {
        where: { tName: tname}});
    return `Updated ${tname} to ${rating}`;
  }
  catch(e){
    console.log(e);
    throw e;
  }
  return 
}

function addTuser(tname){
      tUser.create({ tName: tname, rating: 1200});
}



// Function called when the "dice" command is issued
function rollDice () {
  const sides = 20;
  return Math.floor(Math.random() * sides) + 1;
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}



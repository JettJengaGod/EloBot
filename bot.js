const tmi = require('tmi.js');
// init project
let express = require('express');
let Sequelize = require('sequelize');
let EloRank = require('elo-rank');
let elo = new EloRank();
let app = express();
const Op = Sequelize.Op;
// default user list
let users = [
  ["John", "Hancock"],
  ["Liz", "Smith"],
  ["Ahmed", "Khan"]
];
let tusers = [
  ["alexjett", 1500],
  ["jettelobot", 1400],
  ["jettelobot2", 1200]
];
let User;
let tUser;
let Match;
// setup a new database
// using database credentials set in .env
let sequelize = new Sequelize('database', process.env.DB_USER, process.env.DB_PASS, {
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
    Match = sequelize.define('matches', {
      winner: {
        type: Sequelize.STRING
      },
      w_r: {
        type: Sequelize.INTEGER
      },
      w_rc: {
        type: Sequelize.INTEGER
      },
      loser: {
        type: Sequelize.STRING
      },
      l_r: {
        type: Sequelize.INTEGER
      },
      l_rc: {
        type: Sequelize.INTEGER
      },
    });
    setup();
  })
  .catch(function (err) {
    console.log('Unable to connect to the database: ', err);
  });

// populate table with default users
function setup(){
  User.sync({force : true}) // We use 'force: true' in this example to drop the table users if it already exists, and create a new one. You'll most likely want to remove this setting in your own apps
    .then(function(){
      // Add the default users to the database
      for(let i=0; i<users.length; i++){ // loop through all users
        User.create({ firstName: users[i][0], lastName: users[i][1]}); // create a new entry in the users table
      }
    });
  tUser.sync();
  Match.sync();
}

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/users", function (request, response) {
  let dbUsers=[];
  User.findAll().then(function(users) { // find all entries in the users tables
    users.forEach(function(user) {
      dbUsers.push([user.firstName,user.lastName]); // adds their info to the dbUsers value
    });
    response.send(dbUsers); // sends dbUsers back to the page
  });
});

app.get("/tusers", function (request, response) {
  let dbtUsers=[];
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
// app.get("/reset", function (request, response) {
//   setup();
//   response.redirect("/");
// });

// // removes all entries from the users table
// app.get("/clear", function (request, response) {
//   User.destroy({where: {}});
//   tUser.destroy({where: {}});
//   Match.destroy({where:{}});
//   response.redirect("/");
// });

// listen for requests :)
let listener = app.listen(process.env.PORT, function () {
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
function atHandle(name){
    if(name.startsWith('@')){
      name = name.substring(1);
      return name;
    }
    else{
      return false;
    }
}
// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot
  if (!msg.startsWith('!')){
    return;
  }
  const command = msg.split(' ');
  const usr = context.username;
  const mod = (context.mod || usr === 'alexjett' || usr.toLowerCase() === 't5ace');
  console.log(command,context,mod);
  console.log("**********");
  // Remove whitespace from chat message
  const commandName = msg.trim();
  
    // If the command is known, let's execute it
  // Normal commands
  if (command[0] == `!rating`){
    if(command.length === 1){
      checkNoAdd(usr).then(function(response){
        client.say(target, `Your rating is ${response}`)
      });
    }
    if(command.length === 2){
      let tname = command[1];
      if(tname.startsWith('@')){
        tname = tname.substring(1);
      }
      checkNoAdd(tname).then(function(response){
        client.say(target, `${tname}\'s rating is ${response}`);
      });
    }
  }
  else if (command[0] == `!top` && command.length === 1){
    toplist().then(function(response){
      client.say(target, response);
    })
  }
  else if (command[0] == `!matchlist` && command.length === 1){
    matchlist().then(function(response){
      client.say(target, response);
    })
  }
  else if (command[0] == `!history` && command.length === 1){
    history(atHandle(usr)).then(function(response){
      client.say(target, response);
    })
  }
  else if (command[0] == `!history` && command.length === 2){
    history(atHandle(command[1])).then(function(response){
      client.say(target, response);
    })
  }
    else if (command[0] == `!history` && command.length === 3){
    history_two(atHandle(command[1]),atHandle(command[2])).then(function(response){
      client.say(target, response);
    })
  }
  else if (command[0] == `!link` && command.length === 1){
    client.say(target, `https://topaz-molybdenum.glitch.me`);
  }
  else if (mod && command[0].startsWith('!')){
    // Mod commands
//     if (command[0] == `!add` && command.length == 2) {
//       checkTuser(command[1]);
//       addTuser(command[1]);
//       client.say(target, `You added ${command[1]}`);
//     }
//     else if (command[0] == `!check` && command.length == 2){
//       checkTuser(command[1]).then(function(exists){
//         client.say(target, `You checked ${command[1]} and ${exists}`);
//       });
//     }
//     else if (command[0] == `!update` && command.length == 3){
//       let tname = command[1];
//       let rating = parseInt(command[2]);
//       updateTuser(tname,rating).then(function(response){
//             client.say(target, response);
//           });

//     }
    if (command[0] == `!match` && command.length == 3){
      let winner = command[1];
      if(winner.startsWith('@')){
        winner = winner.substring(1);
      }
      else{
        client.say(target,`Please tag the user with the @ symbol`);
        return;
      }
      let loser = command[2];
      if(loser.startsWith('@')){
        loser = loser.substring(1);
      }
      else{
        client.say(target,`Please tag the user with the @ symbol`);
        return;
      }
      match(winner,loser).then(function(response){
        client.say(target, response);
      });
    }
    else if (command[0] == `!undo` && command.length == 3){
      let winner = command[1];
      if(winner.startsWith('@')){
        winner = winner.substring(1);
      }
      else{
        client.say(target,`Please tag the user with the @ symbol`);
        return;
      }
      let loser = command[2];
      if(loser.startsWith('@')){
        loser = loser.substring(1);
      }
      else{
        client.say(target,`Please tag the user with the @ symbol`);
        return;
      }
      undo(winner,loser).then(function(response){
        client.say(target, response);
      });
    }
    else if (command[0] == `!del` && command.length == 2){
      let loser = command[1]
      if(loser.startsWith('@')){
        loser = loser.substring(1);
      }
      else{
        client.say(target,`Please tag the user with the @ symbol`);
        return;
      }
      delTuser(loser).then(function(exists){
        console.log(exists);
        client.say(target, `You deleted ${loser}`);
      });
    }
    else if (command[0] == `!elohelp` && command.length === 1){
      let res = `\"!rating\" to find your rating
    \"!rating @user\" to find a user's rating
    \"!top\" to find the top 5 users and their ratings.
\"!link\" a webpage with the full ranking list
 Mod commands:
\"!match @winner @loser\" Posts a match with @winner beating @loser
\"!undo @winner @loser\" Undoes the last match with @winner beating @loser`
        client.say(target, res);
    }
  }
  else if (command[0] == `!elohelp` && command.length === 1){
    let res = `\"!rating\" to find your rating
\"!rating @user\" to find a user's rating
\"!top\" to find the top 5 users and their ratings 
\"!link\" a webpage with the full ranking list.`
    client.say(target, res);
  }
  else {
    console.log(`* Unknown command ${commandName}`);
  }
}
async function history_two(usr1,usr2){
  let matches = await Match.findAll({
    limit : 5,
    order : [['createdAt', 'DESC']],
    where : { 
            [Op.or]: [{winner: usr1, loser: usr2}, {winner: usr2, loser: usr1}]
          }
  });
  let out = [];
  let i = 0;
  matches.forEach(function(match) {
    i++;
    out.push([` ${i}.${match.winner}${match.w_r}(+${match.w_rc}) beat ${match.loser}${match.l_r}(${match.l_rc}) `]);
  });
  return `${usr1} vs ${usr2}'s last ${i} matches are ${out}`
}

async function history(usr){
  let matches = await Match.findAll({
    limit : 5,
    order : [['createdAt', 'DESC']],
    where : { 
            [Op.or]: [{winner: usr},{loser: usr}]
          }
  });
  let out = [];
  let i = 0;
  matches.forEach(function(match) {
    i++;
    out.push([` ${i}.${match.winner}${match.w_r}(+${match.w_rc}) beat ${match.loser}${match.l_r}(${match.l_rc}) `]);
  });
  return `${usr}'s last ${i} matches are ${out}`
}
async function matchlist(){
  let matches = await Match.findAll({
    limit : 5,
    order : [['createdAt', 'DESC']]
  });
  let out = [];
  let i = 0;
  matches.forEach(function(match) {
    i++;
    out.push([` ${i}.${match.winner}${match.w_r}(+${match.w_rc}) beat ${match.loser}${match.l_r}(${match.l_rc}) `]);
  });
  return `The last ${i} matches are ${out}`
}

async function toplist(){
  tusers = await tUser.findAll({
    limit : 5,
    order : [['rating', 'DESC']]
  });
  let out = [];
  let i = 0;
  tusers.forEach(function(tname) {
    i++;
    out.push([` ${i}.${tname.tName} ${tname.rating}`]);
  });
  return `The top 5 is ${out}`
}
async function checkNoAdd(tname){
  let count = await tUser.count({ where: {tName: tname}});
  if(count > 0){
    let checked = await tUser.findAll({
        where: {tName: tname}
      });
    return checked[0].rating
  }
  else{
    
    return 'Not found';
  }
}
async function checkTuser(tname){
  let count = await tUser.count({ where: {tName: tname}});
  if(count > 0){
    let checked = await tUser.findAll({
        where: {tName: tname}
      });
    return checked[0].rating
  }
  else{
    addTuser(tname);
    return 1200;
  }
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
function addMatch(winner, loser, w_r, l_r, w_rc, l_rc){
  Match.create({
    winner: winner,
    loser: loser,
    w_r: w_r,
    l_r: l_r,
    w_rc: w_rc,
    l_rc: l_rc
  })
}

function addTuser(tname){
      tUser.create({ tName: tname, rating: 1400});
}
async function delTuser(tname){
  return tUser.destroy({
    where: {tName: tname}
  });
}

async function lastMatch(winner,loser){
  let check = await Match.findAll({
    limit : 1,
    order : [['createdAt', 'DESC']]
  });
  if(check.length > 0){
    return (check[0].winner === winner&&check[0].loser === loser ? true : false)
  }
  else{
    return false;
  }
}
// TODO Fix this 
async function undo(winner,loser){
  let check = await Match.findAll({
    where : {winner: winner, loser: loser},
    limit : 1,
    order : [['createdAt', 'DESC']]
  });
  if(check.length > 0){
    match = check[0]
    if(match.w_r-match.w_rc == 1200){
      delTuser(match.winner);
    }
    else{
      updateTuser(match.winner, match.w_r-match.w_rc);
    }
    if(match.l_r+match.l_rc == 1200){
      delTuser(match.loser);
    }
    else{
      updateTuser(match.loser, match.l_r-match.l_rc);
    }
    await Match.destroy({
      where: { id : match.id }
    })
    console.log(check[0]);
    return `Match between ${winner} and ${loser} deleted.`;
  }
  else{
    return `Match not found are you sure you typed it in right?`;
  }
}

async function match(winner, loser){
  let checklast = await lastMatch(winner, loser);
  if(checklast){
    return `This is the same result as the last match, assuming duplicate.`
  }
  let winner_r = await checkTuser(winner);
  let loser_r = await checkTuser(loser);
  let es_w = elo.getExpected(winner_r,loser_r);
  let es_l = elo.getExpected(loser_r,winner_r);
  console.log(winner,winner_r,loser,loser_r)
  let new_w = elo.updateRating(es_w, 1, winner_r);
  let new_l = elo.updateRating(es_l, 0, loser_r);
  let win_u = await updateTuser(winner, new_w);
  let loser_u = await updateTuser(loser, new_l);
  addMatch(winner, loser, new_w, new_l, new_w-winner_r, new_l-loser_r)
  return `${winner} ${new_w}(+${new_w-winner_r}) defeated ${loser} ${new_l}(-${loser_r-new_l})`
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



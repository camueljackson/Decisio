"use strict";
require('dotenv').config();
const PORT          = process.env.PORT || 8080;
const ENV           = process.env.ENV || "development";
const express       = require("express");
const bodyParser    = require("body-parser");
const sassMiddleware= require("node-sass-middleware");
const app           = express();
const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);


const morgan      = require('morgan');
const knexLogger  = require('knex-logger');
// Seperated Routes for each Resource
const usersRoutes = require("./routes/users");

// mailgun API SetUp
var api_key = 'f245e6e2edf655db13b03dd15bf204f6-e44cc7c1-d7e0206f';
var domain = 'sandboxd9447564f51c474189c20c5be95cd0ac.mailgun.org';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));
// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(sassMiddleware({
  src: "public/scss",
  dest: "public/styles",
  debug: true,
  outputStyle: 'compressed',
  prefix: '/styles'
}));
app.use(express.static("public"));
// Mount all resource routes
app.use("/api/users", usersRoutes(knex));

//===============FUNCTIONS============

function generateRandomString() {
  let randomString = "";
  let allPossibleCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  for (let i = 0; i < 5; i++)
    randomString += allPossibleCharacters.charAt(Math.floor(Math.random() * allPossibleCharacters.length));
  return randomString;
}

//===============GETS===============

// HOME PAGE
app.get("/", (req, res) => {
    res.render("home");
});


// POLLS INDEX PAGE
app.get("/polls", (req, res) => {
  // let templateVars = {
  // };
  res.render("polls_index");
});


// CREATE POLL PAGE
app.get("/polls/new", (req, res) => {
  res.render("polls_new");
});

// VOTING/SPECIFIC POLL PAGE
app.get("/polls/:id", (req, res) => {
  let pollName = '';
  let pollDescription = '';
  let pollID = 0;
  let pollOptions = [];

  // FIND POLL BASED ON URL
  knex.select()
      .from('polls')
      .where('poll_url', req.params.id)
      .then(function (data) {
        pollName = data[0].poll_name;
        pollDescription = data[0].poll_description;
        pollID = data[0].id;
        //FIND POLL OPTIONS BASED ON POLL_ID
        knex.select()
        .from('poll_options')
        .where('poll_id', pollID)
        .then(function (data) {
          for (let i = 0; i < data.length; i++) {
            pollOptions.push(data[i].entry_name);
            // pollOptions[`votes${i}`] = data[i].votes;
          }
          let templateVars = {
            "poll_options": pollOptions,
            "poll_description": pollDescription,
            "poll_name": pollName
          };
          res.render("polls_show", templateVars);
        });
      });
});

// LOGIN PAGE
app.get("/login", (req, res) => {
  res.render("login");
});

// REGISTER PAGE
app.get("/registration", (req, res) => {
  res.render("register");
});


//===============POSTS===============

// CREATE NEW POLL
app.post("/polls", (req, res) => {
  console.log(req.body);
   let emailParticipant = req.body['emails'];
        var data = {
        from: 'Excited User <pbolduc2354@gmail.com>',
        to: emailParticipant,
        subject: 'Hello',
        text: 'Testing some Mailgun awesomeness!'
      };
      mailgun.messages().send(data, function (error, body) {
        console.log(error)
        console.log(body);
      });

  let creatorEmail = req.body['form'][0]['value'];
  let pollName = req.body['form'][1]['value'];
  let pollDescription = req.body['form'][2]['value'];
  let pollUrl = generateRandomString();

  //INSERT DATA
  knex('polls')
  .insert({poll_name: pollName,
    poll_description: pollDescription,
    poll_url: pollUrl,
    creator_email: creatorEmail
    })
  .then( function () {
      //SELECT POLL ID
      knex.select('id')
      .from('polls')
      .where('poll_name', pollName)
      .then(function (data) {
        for (let i = 3; i < req.body.form.length; i++) {
          //STORE SELECTED ID AS FOREIGN KEY, STORE ENTRY NAME
          knex('poll_options')
          .insert({entry_name: req.body['form'][i]['value'],
            votes: 0,
            poll_id: data[0].id
            })
          .then(function () {
          });
        }
      res.status(201).send();
      })
  });
});

// VOTE ON POLL
app.post("/vote", (req, res) => {
  let pollName = req.body.name;
  let pollID = 0;
  let options = req.body.options;
  let bordaCount = options.length;

  // SELECT ID OF CURRENT POLL
  knex
  .select('id')
  .from('polls')
  .where('poll_name', pollName)
  .then(function (data) {
    pollID = data[0].id;

    // UPDATE VOTES ON EACH ENTRY
    for (let i = 0; i < options.length; i++) {
      let entryName = options[i];
      console.log(entryName);
      
      // ++++++++++++++++++++++++++++++++++++
      // SELECT CURRENT VOTE 
      knex
      .select('votes')
      .from('poll_options')
      .where('entry_name', options[i])
      .then(function (currentVote) {

        // UPDATE CURRENT VOTE
        knex
        .table('poll_options')
        .where('poll_id', pollID)
        .andWhere('entry_name', entryName)
        .update({
          votes: (currentVote[0].votes + bordaCount)
        })
        .returning('*')
        .then(result => console.log("Result", result));
        bordaCount--;
      });
    }
  res.status(201).send();
  });
});


app.post("/index", (req, res) => {
  console.log(req.body);

  // knex.select()
  //     .from('polls')
  //     .where('poll_url', req.params.id)
  //     .then(function (data) {
  //       pollName = data[0].poll_name;
  //       pollDescription = data[0].poll_description;
  //       pollID = data[0].id;
  //       //FIND POLL OPTIONS BASED ON POLL_ID
  //       knex.select()
  //       .from('poll_options')
  //       .where('poll_id', pollID)
  //       .then(function (data) {
  //         for (let i = 0; i < data.length; i++) {
  //           pollOptions.push(data[i].entry_name);
  //           // pollOptions[`votes${i}`] = data[i].votes;
  //         }
  //         let templateVars = {
  //           "poll_options": pollOptions,
  //           "poll_description": pollDescription,
  //           "poll_name": pollName
  //         };
  //         res.render("polls_show", templateVars);
  //       });
  //     });
});

// DELETE POLL
app.delete("/polls/:id", (req, res) => {
  // let pollID = req.params.id;
    knex('polls')
    .where('id', pollID)
    .del()
    .finally(function() {
      knex.destroy();
    });
});

// REDIRECT - CREATE POLL BUTTON => CREATE PAGE
// app.post("/pollsredirect", (req, res) => {
//   res.status(201).send();
// });

// Edit poll?
// app.put("/polls/:id", (req, res) => {
// });

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
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
  console.log(req.body);

  let pollOptions = {};
  let pollInfo = {}

  // FIND POLL BASED ON URL (MAYBE CHANGE TO NAME)
  knex.select()
      .from('polls')
      .where('')
      .then(function (poll) {
        pollInfo = poll;
        console.log("FOUND POLL")
      })
      .finally(function() {
        knex.destroy();
      });
  console.log(pollInfo);

  // FIND POLL OPTIONS BASED ON POLL ID
  // knex.select()
  //     .from('poll_options')
  //     .where('poll_id', pollInfo.id)
  //     .then(function (data) {
  //       pollOptions = data;
  //       console.log("FOUND POLL OPTIONS")
  //     })
  //     .finally(function() {
  //       knex.destroy();
  //     });
  // console.log(pollOptions);


  // templateVars = {
  //   "poll_options": pollOptions,
  //   "poll": pollInfo
  // };

  // ADD TEMPLATE VARS WHEN KNEX QUERIES ARE VERIFIED
  res.render("polls_show");
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
console.log(data);
      mailgun.messages().send(data, function (error, body) {
        console.log(error)
        console.log(body);
      });

  let creatorEmail = req.body['form'][0]['value'];
  let pollName = req.body['form'][1]['value'];
  let pollDescription = req.body['form'][3]['value'];
  let pollUrl = generateRandomString();


  // knex('polls')
  // .insert({poll_name: pollName,
  //   poll_description: pollDescription,
  //   poll_url: pollUrl,
  //   creator_email: creatorEmail
  //   });


  // knex.select('id')
  // .from('polls')
  // .where('poll_name', pollName)
  // .then(function (data) {
  //   pollID = data;
  // })
  // .finally(function() {
  //   knex.destroy();
  // });

  // console.log(pollID);
  // for (let i = 0; i < req.body.something.length, i++) {
  //   knex('poll_options')
  //   .insert({entry_name: '',
  //     votes: 0,
  //     poll_id: pollID
  //     });
  // }

  // res.redirect("/polls/:id");
  res.status(201).send();
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
app.post("/pollsredirect", (req, res) => {
  res.status(201).send();
});

// Edit poll?
// app.put("/polls/:id", (req, res) => {
// });

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
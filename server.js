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
  let pollOptions = {};

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
            pollOptions[`option${i}`] = data[i].entry_name;
            pollOptions[`votes${i}`] = data[i].votes;
          }
          let templateVars = {
            "poll_options": pollOptions,
            "poll_decription": pollDescription,
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

  let creatorEmail = req.body['form'][0]['value'];
  let pollName = req.body['form'][1]['value'];
  let pollDescription = req.body['form'][2]['value'];
  let pollUrl = generateRandomString();

  knex('polls')
  .insert({poll_name: pollName,
    poll_description: pollDescription,
    poll_url: pollUrl,
    creator_email: creatorEmail
    })
  .then( function () {
      knex.select('id')
      .from('polls')
      .where('poll_name', pollName)
      .then(function (data) {
        for (let i = 3; i < req.body.form.length; i++) {
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
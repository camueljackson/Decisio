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
app.use(cookieSession({
  name: 'session',
  keys: ["77777", "99181"],
  maxAge: 24 * 60 * 60 * 1000
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

// Home page
app.get("/", (req, res) => {
    res.render("home");
});


// Polls index page
app.get("/polls", (req, res) => {
  // let templateVars = {
  // };
  res.render("polls_index");
});


// // Create poll page
app.get("/polls/new", (req, res) => {
  res.render("polls_new");
});

// Specific poll ID page
app.get("/polls/:id", (req, res) => {
  console.log(req.body);
  
  let pollOptions = {};
  let pollInfo = {}

  // find poll based on url
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

  res.render("polls_show");
});


//===============POSTS===============

// New poll post
app.post("/polls", (req, res) => {
  console.log(req.body);

  // let pollName = '';
  // let pollDescription = '';
  // let pollUrl = generateRandomString();
  // let creatorEmail = '';

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

// Specific poll ID DELETE
app.delete("/polls/:id", (req, res) => {
  // let pollID = req.params.id;
    knex('polls')
    .where('id', pollID)
    .del()
    .finally(function() {
      knex.destroy();
    });
});

// Edit poll?
// app.put("/polls/:id", (req, res) => {
// });
// // Home page Login button post
// app.post("/login-home", (req, res) => {
//   res.redirect("/login");
// });
// // Home page Register button post
// app.post("/register-home", (req, res) => {
//   res.redirect("/register");
// });
app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
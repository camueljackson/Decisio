"use strict";
require('dotenv').config();
const PORT          = process.env.PORT || 8080;
const ENV           = process.env.ENV || "development";
const express       = require("express");
const bodyParser    = require("body-parser");
const cookieSession = require('cookie-session');
const bcrypt        = require('bcryptjs');
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
//checks for user
function currentUser (req) {
  return req.session.user_id;
}
function userInfo (req) {
  let user = {};
  knex.select().from("users")
  .where("id",  req.session.user_id)
  .then(function (data) {
    user = data;
  })
  .finally(function() {
    knex.destroy();
  });
  return user;
}
function generateRandomString() {
  let randomString = "";
  let allPossibleCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 5; i++)
    randomString += allPossibleCharacters.charAt(Math.floor(Math.random() * allPossibleCharacters.length));
  return randomString;
}
//===============GETS===============
// Home page
app.get("/", (req, res) => {
  // let userPresent = currentUser(req);
  // if(userPresent) {
  //   res.redirect('/polls_index');
  // } else {
    res.render("home");
  // }
});
// Polls index page
app.get("/polls", (req, res) => {
//   let userPresent = currentUser(req);
//   if(userPresent) {
//       let user = userInfo(req);
//       templateVars = {
//         "user": user
//       };
//     res.render("polls_index", templateVars);
//   } else {
//     res.redirect("/home");
//   }
res.render("polls_index")
});
// // Create poll page
app.get("/polls/new", (req, res) => {
//   let userPresent = currentUser(req);
//   if(userPresent) {
//       let user = userInfo(req);
//       templateVars = {
//         "user": user
//       };
//     res.render("poll_new", templateVars);
//   } else {
//     res.redirect("/home");
//   }
  res.render("polls_new");
});
// Specific poll ID page
app.get("/polls/:id", (req, res) => {
  // console.log(req.body);
  // let userPresent = currentUser(req);
  // // Selecting poll options from database
  // let pollOptions = {};
  // knex.select()
  //     .from('poll_options')
  //     .where('poll_id', req.body)
  //     .then(function (data) {
  //       pollOptions = data;
  //     })
  //     .finally(function() {
  //       knex.destroy();
  //     });
  // console.log(pollOptions);
  // if (userPresent) {
  //   let user = userInfo();
  //   templateVars = {
  //     "user": user,
  //     "poll_options": pollOptions
  //   };
  //   res.render("polls_show", templateVars);
  // } else {
  //   templateVars = {
  //     "poll_options": pollOptions
  //   };
  //   res.render("polls_show", templateVars);
  // }
  res.render("polls_show");
});
// Registration page
app.get("/registration", (req, res) => {
  // let userPresent = currentUser(req);
  // if(userPresent) {
  //     let user = userInfo(req);
  //     templateVars = {
  //       "user": user
  //     };
  //   res.render("register", templateVars);
  // } else {
    res.render("register");
  // }
});
// Login page
app.get("/login", (req, res) => {
  // let userPresent = currentUser(req);
  // if(userPresent) {
  //     let user = userInfo(req);
  //     templateVars = {
  //       "user": user
  //     };
  //   res.render("login", templateVars);
  // } else {
    res.render("login");
  // }
});
//===============POSTS===============
// New poll post
app.post("/polls", (req, res) => {
  // console.log(req.body);
  // knex('polls')
  // .insert({poll_name: , poll_description: , user_id: req.session.user_id});
  // let pollID = 0;
  // knex.select('id')
  // .from('polls')
  // .where('poll_name', poll_name)
  // .then(function (data) {
  //   pollID = data;
  // })
  // .finally(function() {
  //   knex.destroy();
  // });;
  // console.log(pollID);
  // knex('poll_options')
  // .insert({entry_name: , votes: 0, poll_id: pollID});
  res.redirect("/polls/:id");
});
// Login post
app.post("/login", (req, res) => {
  let emailCheck = req.body.email;
  let passwordCheck = req.body.password;
  let user = {};

  knex.select().from('users')
                  .where('email', req.body.email)
                  .then(function (data) {
                    console.log(data);
                    user = data;
                  })
                  .finally(function() {
                    knex.destroy();
                  });
  console.log(user);

//email/password match check
// if(emailCheck === users[checkUser]["email"] && bcrypt.compareSync(passwordCheck, users[checkUser]["password"])) 
// req.session.user_id = users[checkUser]["cookie_id"];
// res.redirect("/polls_index");

});

// Registration post
app.post("/registration", (req, res) => {
  let cookieID = generateRandomString();
  let password = req.body.password;
  let hashedPassword = bcrypt.hashSync(password, 10);
  let userName = req.body.username;
  let userEmail = req.body.email;

  knex('users')
  .insert({ 
    username: userName, 
    email: userEmail, 
    password: hashedPassword})
  .return('id')
  .then((id) => { 
    req.session.user_id = id;
    res.status(201).send();
  });
});

// Logout post
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/home");
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
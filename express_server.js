// declare modules
const express = require("express");
const methodOverride = require("method-override");
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');
const { name } = require("ejs");
const app = express();
const PORT = 8080; // default port 8080

// import functions and databases from other files
const { getRandomString, getUserByEmail, urlsForUser } = require('./helpers');
const { users, urlDatabase } = require('./database');

// use middleware and modules and config
app.use(methodOverride("_method")); // uses method overwrite

app.use(cookieSession({
  name: 'user_id',
  keys: ["sajdnjskanfkjahdil"]
})); // allows use and transfer of cookies

app.use(express.urlencoded({ extended: true })); // Express middleware

app.set("view engine", "ejs"); // allows use of ejs
 
// Listen for client
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});


// Show urlDatabase as JSON file
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// render urls_index page. can refresh here to retest
app.get("/urls", (req, res) => {

  const templateVars = { 
    urls: urlDatabase, 
    user: users[req.session.user_id] 
  };

  res.render("urls_index", templateVars);
});

// this section allows the user to input a new URL
app.get("/urls/new", (req, res) => {

  // if user is not logged in, redirect them to login
  if (!req.session.user_id) {
    res.redirect("/login");
  }

  const templateVars = { user: users[req.session.user_id] };
  res.render("urls_new", templateVars);
});

// this section shows the URL details page
app.get("/urls/:id", (req, res) => {

  // check if id exists
  const checkID = Object.keys(urlDatabase).includes(req.params.id);
  if (!checkID) {
    res.redirect("/error");
  }

  // checks if user owns the id
  let checkWebsite = urlsForUser(req.session.user_id, urlDatabase);

  if (!(checkWebsite).includes(urlDatabase[req.params.id].longURL)) {
    res.redirect("/error");
    return;
  }

  // shows url info
  req.session.views = (req.session.views || 0) + 1;
  console.log("Viewwwwwwws: ", req.session.views);

  const templateVars = { 
    id: req.params.id, 
    longURL: urlDatabase[req.params.id].longURL, 
    user: users[req.session.user_id], 
    timesViewed: req.session.views 
  };

  res.render("urls_show", templateVars);
});

// This section creates a new URL and adds it to the index
app.post("/urls", (req, res) => {

  if (!req.session.user_id) {
    res.send("<html><body>You cannot shorten URL's because you are not logged in</body></html>");
    return;
  }

  let newUrl = getRandomString();
  urlDatabase[newUrl] = { 
    userID: req.session.user_id, 
    longURL: req.body.longURL 
  };

  // Redirect to URL Index with new Url
  const templateVars = { urls: urlDatabase, user: users[req.session.user_id] };

  // add new user
  res.render("urls_index", templateVars);
});

// this section redirects fron the path to the longURL
app.get("/u/:id", (req, res) => {

  const checkID = Object.keys(urlDatabase).includes(req.params.id);

  if (!checkID) {
    res.redirect("/error");
  }

  const longURL = urlDatabase[req.params.id].longURL;
  res.redirect(longURL);
});

// this section deletes an id and URL
app.delete("/urls/:id", (req, res) => {

  // check if id exists
  const checkID = Object.keys(urlDatabase).includes(req.params.id);
  if (!checkID) {
    res.redirect("/error");
  }

  // checks if user owns the id
  let checkWebsite = urlsForUser(req.session.user_id, urlDatabase);
  if (!(checkWebsite.includes(urlDatabase[req.params.id].longURL))) {
    res.redirect("/error");
    return;
  }

  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});

// this section updates the long URL of an ID
app.put("/urls/:id", (req, res) => {
  urlDatabase[req.params.id].longURL = req.body.longURL;
  res.redirect("/urls");
});

// this section leads the user to the login page
app.get("/login", (req, res) => {

  // if user is already logged in, redirect to /urls
  if (req.session.user_id) {
    res.redirect("/urls");
  }

  const templateVars = { user: null };
  res.render("urls_login", templateVars);
});

// this section lets the user log in
app.post("/login", (req, res) => {

  // check if email is present in database
  const existingUser = getUserByEmail(req.body.email, users);

  if (existingUser) {
    
    // check if password is correct
    const hashedPassword1 = bcrypt.hashSync(req.body.password, 10);
    const passwordCheck = bcrypt.compareSync(req.body.password, hashedPassword1);

    if (passwordCheck) {
      req.session.user_id = existingUser.id;
      res.redirect("/urls");
    } else {
      res.redirect("/error");
    }

  } else {
    res.redirect("/error");
  }

});

// this section lets the user log out and clears all cookies
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});

// this section leads to the registration page
app.get("/register", (req, res) => {

  // if user is already logged in, redirect to /urls
  if (req.session.user_id) {
    res.redirect("/urls");
  }

  const templateVars = { user: null };
  res.render("url_register", templateVars);
});

// this section adds a new user to the Users database
app.post("/register", (req, res) => {

  if ((req.body.email).length === 0) {
    // res.status(400).send("Please input an email");
    res.redirect("/error");
  }

  const emailPresent = getUserByEmail(req.body.email, users) // checks if e-mail is already present 
  if (emailPresent) {
    // res.status(400).send("Invalid credentials");
    res.redirect("/error");
  }

  let newRandomId = getRandomString();
  let hashedPassword = bcrypt.hashSync(req.body.password, 10);
  console.log("New hashed password", hashedPassword);
  users[newRandomId] = { id: newRandomId, email: req.body.email, password: hashedPassword };
  req.session.user_id = newRandomId;
  res.redirect("/urls");
});

// error screen
app.get("/error", (req, res) => {
  let id = (req.session.userID || null);
  const templateVars = { user: id };
  res.render("urls_error", templateVars);
})
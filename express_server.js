const express = require("express");
const methodOverride = require("method-override");
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');
const { name } = require("ejs");
const app = express();
const PORT = 8080; // default port 8080

const { getUserByEmail, urlsForUser } = require('./helpers');
const { users, urlDatabase } = require('./database');

app.use(methodOverride("_method")); // uses method overwrite

app.use(cookieSession({
  name: 'user_id',
  keys: ["sajdnjskanfkjahdil"]
})); // allows use and transfer of cookies

app.set("view engine", "ejs"); // allows use of ejs

// function to get random string to create smaller URL and userID
const getRandomString = () => {
  // credit to - https://attacomsian.com/blog/javascript-generate-random-string
  let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  //Pick characters randomly
  let str = '';
  for (let i = 0; i < 6; i++) {
    str += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return str;
};

// Test. Delete later
app.get("/", (req, res) => {
  res.send("Hello");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

// Express middleware
app.use(express.urlencoded({ extended: true }));

// Show urlDatabase as JSON file
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// unneeded...remove later
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b><body><html>");
});

// render urls_index page. can refresh here to retest
app.get("/urls", (req, res) => {

  const templateVars = { urls: urlDatabase, user: users[req.session.user_id] };

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
    res.send("<html>This ID Does Not Exist.</html>");
  }

  // checks if user owns the id
  let checkWebsite = urlsForUser(req.session.user_id, urlDatabase);
  // console.log("Check user: ", urlsForUser(req.session.user_id));

  // shows url info
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id].longURL, user: users[req.session.user_id], ownsID: (checkWebsite.includes(urlDatabase[req.params.id].longURL)) };

  res.render("urls_show", templateVars);
});

// This section creates a new URL and adds it to the index
app.post("/urls", (req, res) => {

  if (!req.session.user_id) {
    res.send("<html><body>You cannot shorten URL's because you are not logged in</body></html>");
    return;
  }

  let newUrl = getRandomString();
  console.log("Current session", req.session);
  urlDatabase[newUrl] = { userID: req.session.user_id, longURL: req.body.longURL }

  // Redirect to URL Index with new Url
  const templateVars = { urls: urlDatabase, user: users[req.session.user_id] };

  // add new user
  res.render("urls_index", templateVars);
});

// this section redirects fron the path to the longURL
app.get("/u/:id", (req, res) => {

  const checkID = Object.keys(urlDatabase).includes(req.params.id);

  if (!checkID) {
    res.send("<html>This ID Does Not Exist.</html>")
  }

  const longURL = urlDatabase[req.params.id].longURL;
  res.redirect(longURL);
});

// this section deletes an id and URL

app.delete("/urls/:id", (req, res) => {

  // check if id exists
  const checkID = Object.keys(urlDatabase).includes(req.params.id);

  if (!checkID) {
    res.send("<html>This ID Does Not Exist.</html>");
  }

  // checks if user owns the id

  let checkWebsite = urlsForUser(req.session.user_id, urlDatabase);
  // console.log("Check user: ", urlsForUser(req.session.user_id));

  if (!(checkWebsite.includes(urlDatabase[req.params.id].longURL))) {
    res.send("This user does not own the url", 403);
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
  console.log("Existing user", existingUser);

  if (existingUser) {
    
    // check if password is correct
    const hashedPassword1 = bcrypt.hashSync(req.body.password, 10);
    const passwordCheck = bcrypt.compareSync(req.body.password, hashedPassword1);
    console.log("Check password :", passwordCheck);
    console.log("Hashed password: ", hashedPassword1);
    console.log("Existing user password: ", existingUser.password);

    if (passwordCheck) {
      // res.cookie("user_id", existingUser.id); - Old syntax, when using cookie parser
      req.session.user_id = existingUser.id;
      res.redirect("/urls");
    } else {
      res.send("Invalid credentials", 400);
    }

  } else {
    res.status(400).send("Invalid credentials");
  }

});

// this section lets the user log out and clears all cookies
app.post("/logout", (req, res) => {
  // res.clearCookie("user_id");
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
    res.status(400).send("Please input an email");
  }

  const emailPresent = getUserByEmail(req.body.email, users) // checks if e-mail is already present 
  if (emailPresent) {
    res.status(400).send("Invalid credentials");
  }


  let newRandomId = getRandomString();
  let hashedPassword = bcrypt.hashSync(req.body.password, 10);
  console.log("New hashed password", hashedPassword);
  users[newRandomId] = { id: newRandomId, email: req.body.email, password: hashedPassword };
  // res.cookie("user_id", newRandomId); - Old cookie-parser syntax
  req.session.user_id = newRandomId;
  res.redirect("/urls");
});
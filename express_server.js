const express = require("express");
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8080; // default port 8080

app.use(cookieParser()); // allows use and transfer of cookies

app.set("view engine", "ejs"); // allows use of ejs

// function to get tandom string to create smaller URL
const getRandomString = () => {
  // credit to - https://attacomsian.com/blog/javascript-generate-random-string
  let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  //Pick characters randomly
  let str = '';
  for(let i = 0; i < 6; i++) {
    str += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return str;
};

// URL Database. New URL's will be added here
const urlDatabase = {
  "b2xVn2" : "http://www.lighthouselabs.ca",
  "9sm5xK" : "http://www.google.com",
};

// User database. New users will be added here.
const users = {
  userRandomID: {
    id:"userRandomID",
    email:"user@example.com",
    password:"purple-monkey-dinosaur",
  },

  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

// Function that checks user database to see if the same email has been input
const checkUserDatabase = (newEmail) => {
  let objKeys = Object.keys(users);
  
  for (let i = 0; i < objKeys.length; i++) {
    if (newEmail === users[objKeys[i]].email) {
      return users[objKeys[i]];
    }
  }

  return null;
}

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
  
  // console.log("Inside /urls route handler", req.cookies["user_id"]);
  const templateVars = { urls: urlDatabase, user: users[req.cookies["user_id"]] };

  res.render("urls_index", templateVars);
});

// this section allows the user to input a new URL
app.get("/urls/new", (req, res) => {

  // if user is not logged in, redirect them to login
  if(!req.cookies["urls_id"]) {
    res.redirect("/login");
  }

  const templateVars = { user: users[req.cookies["user_id"]] };
  
  res.render("urls_new", templateVars);
});

// this section shows the URL details page
app.get("/urls/:id", (req, res) => {

  const checkID = Object.keys(urlDatabase).includes(req.params.id);
  console.log("Value of checkID is ", checkID);

  if(!checkID) {
    res.send("<html>This ID Does Not Exist.</html>");
  }

  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id], user: users[req.cookies["user_id"]]};
  
  res.render("urls_show", templateVars);
});

// This section creates a new URL and adds it to the index
app.post("/urls", (req, res) => {
  // console.log(req.body);

  if (!req.cookies["urls_id"]) {
    res.send("<html><body>You cannot shorten URL's because you are not logged in</body></html>");
    return;
  }

  let newUrl = getRandomString();
  urlDatabase[newUrl] = req.body.longURL;
  
  // Redirect to URL Index with new Url
  const templateVars = { urls: urlDatabase, user: users[req.cookies["user_id"]]};

  // add new user
  // console.log(users[req.cookies["user_id"]]);
  res.render("urls_index", templateVars);
});

// this section redirects fron the path to the longURL
app.get("/u/:id", (req, res) => {

  const checkID = Object.keys(urlDatabase).includes(req.params.id);
  console.log("Value of checkID is ", checkID);

  if(!checkID) {
    res.send("<html>This ID Does Not Exist.</html>")
  }

  const longUrl = urlDatabase[req.params.id];
  res.redirect(longUrl);
});

// this section deletes an id and URL
app.post("/urls/:id/delete", (req, res) => {
  // console.log(req.params);
  delete urlDatabase[req.params.id];
  // const templateVars = { urls: urlDatabase };
  res.redirect("/urls");
});

// this section updates the long URL of an ID
app.post("/urls/:id/longURL", (req, res) => {
  // console.log(req.body.longURL);
  urlDatabase[req.params.id] = req.body.longURL;
  res.redirect("/urls");
});

// this section leads the user to the login page
app.get("/login", (req, res) => {

  // if user is already logged in, redirect to /urls
  // console.log("Check user ID cookie", req.cookies["user_id"]);
  if(req.cookies["user_id"]) {
    res.redirect("/urls");
  }

  const templateVars = { user: null };
  res.render("urls_login", templateVars);
});

// this section lets the user log in
app.post("/login", (req, res) => {
  
  const passwordCheck = req.body.password;

  // check if email is present in database
  const existingUser = checkUserDatabase(req.body.email);
  console.log(existingUser);

  // check if email and password are correct
  if (existingUser && existingUser.password === passwordCheck) {
    res.cookie("user_id", existingUser.id);
    res.redirect("/urls");
  } else {
    res.status(400).send("Invalid credentials");
  }

});

// this section lets the user log out and clears all cookies
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/login");
});

// this section leads to the registration page
app.get("/register", (req, res) => {

  // if user is already logged in, redirect to /urls
  // console.log("Check user ID cookie", req.cookies["user_id"]);
  if(req.cookies["user_id"]) {
    res.redirect("/urls");
  }

  const templateVars = { user: null };
  res.render("url_register", templateVars);
});

// this section adds a new user to the Users database
app.post("/register", (req, res) => {

  if((req.body.email).length === 0) {
    res.status(400).send("Please input an email");
  }

  const emailPresent = checkUserDatabase(req.body.email) // checks if e-mail is already present 
  if(emailPresent) {
    res.status(400).send("Invalid credentials");
  }
  
  
  let newRandomId = getRandomString();
  users[newRandomId] = { id: newRandomId, email: req.body.email, password: req.body.password};
  res.cookie("user_id", newRandomId);
  res.redirect("/urls");
});
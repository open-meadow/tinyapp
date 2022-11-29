const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

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

const urlDatabase = {
  "b2xVn2" : "http://www.lighthouselabs.ca",
  "9sm5xK" : "http://www.google.com",
};

app.get("/", (req, res) => {
  res.send("Hello");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

app.use(express.urlencoded({ extended: true }));

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b><body><html>");
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

// this section allows the user to input a new URL
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

// this section shows the URL details page
app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id], username: req.cookies['username']};
  res.render("urls_show", templateVars);
});

// This section creates a new URL and adds it to the index
app.post("/urls", (req, res) => {
  console.log(req.body);
  let newUrl = getRandomString();
  urlDatabase[newUrl] = req.body.longURL;
  // res.send("Ok");
  // Redirect to URL Index with new Url
  const templateVars = { urls: urlDatabase, username: req.cookies['username'] };
  res.render("urls_index", templateVars);
});

// this section redirects fron the path to the longURL
app.get("/u/:id", (req, res) => {
  const longUrl = urlDatabase[req.params.id];
  res.redirect(longUrl);
});

// this section deletes an id and URL
app.post("/urls/:id/delete", (req, res) => {
  console.log(req.params);
  delete urlDatabase[req.params.id];
  // const templateVars = { urls: urlDatabase };
  res.redirect("/urls");
});

// this section updates the long URL of an ID
app.post("/urls/:id/longURL", (req, res) => {
  console.log(req.body.longURL);
  urlDatabase[req.params.id] = req.body.longURL;
  res.redirect("/urls");
});

// this section lets the user log in
app.post("/login", (req, res) => {
  console.log(req.body.username);
  res.cookie(req.body.username);
  console.log("Cookie set");
  res.redirect("/urls");
});

// if the user has logged in, this section will show the username
// const templateUsername = {
//   username: req.cookies['username'],
// };
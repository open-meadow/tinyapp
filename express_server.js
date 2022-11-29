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
  res.send("<html><body>Hello <b>World</b><body><html>")
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars)
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id]};
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  console.log(req.body);
  let newUrl = getRandomString();
  urlDatabase[newUrl] = req.body;
  res.send("Ok");
});

app.get("/u/:id", (req, res) => {
  const longUrl = urlDatabase[req.params.id];
  res.redirect(longUrl);
});
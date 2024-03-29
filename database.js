// User database. New users will be added here.
const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },

  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

// URL Database. New URL's will be added here
const urlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userID: "userRandomID",
    views: 0,
    uniqueViews: 1,
    visits: []
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    userID: "user2RandomID",
    views: 0,
    uniqueViews: 1,
    visits: []
  },
};

module.exports = { users, urlDatabase };
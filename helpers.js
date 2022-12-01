const { users, urlDatabase } = require('./database');

// Function that checks user database to see if the same email has been input
const getUserByEmail = (newEmail, users) => {
  let objKeys = Object.keys(users);

  for (let i = 0; i < objKeys.length; i++) {
    if (newEmail === users[objKeys[i]].email) {
      return users[objKeys[i]];
    }
  }

  return null;
}

// check the URL's a user ID has saved
const urlsForUser = (id, urlDatabase) => {
  let objKeys = Object.keys(urlDatabase);
  let urlArrs = [];

  for (let i = 0; i < objKeys.length; i++) {
    if (id === urlDatabase[objKeys[i]].userID) {
      urlArrs.push(urlDatabase[objKeys[i]].longURL);
    }
  }

  return urlArrs;
};

module.exports = { getUserByEmail, urlsForUser };
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
  let urlObjs = {};

  for (let i = 0; i < objKeys.length; i++) {
    if (id === urlDatabase[objKeys[i]].userID) {
      urlObjs[objKeys[i]] = urlDatabase[objKeys[i]].longURL;
    }
  }

  return urlObjs;
};

module.exports = { getRandomString, getUserByEmail, urlsForUser };
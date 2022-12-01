const { assert } = require('chai');

const { getUserByEmail, urlsForUser } = require('../helpers');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

const testURLs = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userID: "userRandomID",
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    userID: "user2RandomID",
  },
}

describe('getUserByEmail', () => {
  it('should return a user with a valid email', () => {
    const user = getUserByEmail("user@example.com", testUsers);
    const expectedUserID = "userRandomID";

    assert.isOk(user, expectedUserID);
  });

  it("wrong email should return null", () => {
    const user = getUserByEmail("a@amail.com", testUsers);
    const expectedUserID = "userRandomID";

    assert.isNotOk(user, null);
    assert.isNotOk(user, expectedUserID);
  });

  it("blank string should return null", () => {
    const user = getUserByEmail(" ", testUsers);

    assert.isNotOk(user, null);
  })
});

describe('urlsForUser', () => {
  it('should return an array with valid URLs', () => {
    const userURL = urlsForUser("userRandomID", testURLs);
    const expected = "http://www.lighthouselabs.ca";

    assert.equal(userURL, expected);
  });

  it("blank string should return empty", () => {
    const userURL = urlsForUser("", testURLs);
    const expected = "";

    console.log(userURL);
    assert.equal(userURL, expected);
  });
});
# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly). It requires user registration. However, your passwords will be stored with military-grade encryption, which you can confirm by typing "/users.json" at the end of the URL.

## Screenshots

!["Screenshot of URLs page"](https://github.com/open-meadow/tinyapp/blob/master/docs/urls-page.png)
!["Screenshot of single URL page"](https://github.com/open-meadow/tinyapp/blob/master/docs/single-url-page.png)
!["Screenshot of "Create new URL" page"](https://github.com/open-meadow/tinyapp/blob/master/docs/create-new-url-page.png)

## Dependencies

- Node.js
- Express
- EJS
- bcryptjs
- cookie-session

## Getting Started
- You need to have Node JS installed on your computer. You can download it at (https://nodejs.org/en/).
- Once you have Node JS, go to your desired folder, open the terminal or command prompt, and type <code>git clone git@github.com:open-meadow/tinyapp.git tinyapp</code>, if you have git. Alternatively, you can download the ZIP file and extract it to your desired folder.
- Once done, navigate to the folder containing the downloaded code, and open your terminal or command prompt in the same folder. Type `npm install` Windows users may need to run cmd as administrator.
- Once installed, type `npm start` and click `Enter`.
- Go to your favourite web browser, and type `localhost:8080` in the address bar. Hit `Enter`. You should be able to access the website.


## Known bugs
- LocalCDN extension (https://www.localcdn.org/) causes display errors in Firefox. Chromium browsers unknown.
- ~~After creating a new URL and clicking `Edit`, the first count displays NaN and the next click increments from 1.~~ (Fixed)
- ~~Code only checks for email and not password. Meaning anyone having just a registered e-mail can access the site~~ (Fixed)
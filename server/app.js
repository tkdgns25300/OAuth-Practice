const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
require('dotenv').config();


// Google Auth
const { OAuth2Client } = require("google-auth-library");
const CLIENT_ID = process.env.CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);

const PORT = process.env.PORT || 5000;

// Middleware
app.set("view engine", "ejs");
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  let token = req.body.token;
  // console.log(token);

  // client에서 받아온 token과 Client ID를 이용해 유효한 token인지 확인
  // => token 이 authorization code아닌가?
  async function verify() {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,
    });
    const payload = ticket.getPayload();
    // const userid = payload['sub'];
    // console.log(payload);
  }
  verify()
  .then(() => {
      res.cookie('session-token', token);
      res.send('success');
  })
  .catch(console.error);
});

app.get('/profile', (req, res) => {
    let user = req.user;
    res.render('profile', { user });
})

app.get('/protectedroute', (req, res) => {
    res.render('protectedroute');
})

app.get('/logout', (req, res) => {
    res.clearCookie('session-token');
    res.redirect('/login');
})


function checkAuthenticated(req, res, next) {
    let token = req.cookies('session-token');

    let user = {};
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.CLIENT_ID,
        });
        const payload = ticket.getPayload();
        user.name = payload.name;
        user.email = payload.email;
        user.picture = payload.picture;
    }
    verify()
    .then(() => {
        req.user = user;
        next();
    })
    .catch(err => {
        res.redirect('/login')
    })

}

 


app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

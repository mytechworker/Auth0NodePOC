const express = require("express");
require("dotenv").config();
let path = require('path');

const app = express();
const { auth, requiresAuth } = require('express-openid-connect');

app.set('view engine', 'ejs');

app.set("views", path.join(__dirname, "views"));

app.use(express.static('static'));

app.use(
    auth({
        issuerBaseURL: process.env.ISSUER_BASE_URL,
        baseURL: process.env.BASE_URL,
        clientID: process.env.CLIENT_ID,
        secret: process.env.SECRET,
        idpLogout: true,
        authRequired: false
    })
);

app.get('/', (req, res) => {
    const isAuthenticated = req.oidc.isAuthenticated();
    res.render('home', {
        isAuthenticated: isAuthenticated
    });
});

// app.get('/home', (req, res) => {
//     const isAuthenticated = req.oidc.isAuthenticated();
//     res.render('home', {
//         isAuthenticated: isAuthenticated
//     });
// });

app.get('/protected', requiresAuth(), (req, res) => {
    res.send('<p>This is a protected page</p>')
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

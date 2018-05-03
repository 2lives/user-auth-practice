const express = require('express');
const bodyParser = require('body-parser');
const app = express();
var path = require('path');
const session = require('express-session');
const parseurl = require('parseurl');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const port = 4000;

// const auth = (req, res, next) => {
//     function unauthorized(res) {
//         res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
//         res.sendStatus(401);
//     }
//     let authHeader = req.headers.authorization.split('')[1];
//     authHeader = new Buffer(authHeader, 'base64');
//     const [login, password] = authHeader.toString().split(':');
//     if (login === 'mack' && password == 'mack') {
//         next();
//     } else {
//         return unauthorized(res);
//     }
// };

const APP_SECRET = process.env.APP_SECRET || 'keyboardcat';

const config = {
    JWT: {
        name: 'thusday_token',
        secret: APP_SECRET,
        expires: 60 * 60 * 60
    }
};

const auth = (req, res, next) => {
    if (!req.cookies || !req.cookies[config.JWT.name]) {
        return res.status(401).redirect('/login');
    }
    //do we have a copokie? is the cookie our user token?

    try {
        //decode user from the token

        const user = jwt.verify(
            req.cookies[config.JWT.name],
            config.JWT.secret
        );

        if (!user || !(user.email === 't1thegod@gmaill.com'))
            return res.status(401).redirect('/login');
        next();
    } catch (e) {
        //something went wrong decoding the token
        res.status(500).redirect('/login');
    }
};

app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

//.use intercepts in this case, home page
app.get('/', auth, (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});

app.post(
    '/authenticate',
    bodyParser.urlencoded({ extended: true }),
    (req, res) => {
        if (!req.body.username || !req.body.password) {
            res.status(400).redirect('/login');
        } else if (
            //can be replaces with an SQL query for DB checking
            //logout happens client side (delete the cookie)
            req.body.username === 'brandon' &&
            req.body.password === 'brandon'
        ) {
            const token = jwt.sign(
                {
                    name: 'tyler1',
                    email: 't1thegod@gmaill.com',
                    admin: true
                },
                config.JWT.secret,
                {
                    expiresIn: config.JWT.expires
                }
            );

            res.cookie(config.JWT.name, token, {
                maxAge: config.JWT.expires,
                secure: process.env.NODE_ENV === 'production' ? true : false
            });
            console.log(token);
            res.status(200).redirect('/');
        } else {
            res.status(400).redirect('/login');
        }
    }
);

app.post('/submit', bodyParser.urlencoded({ extended: true }), (req, res) => {
    //     console.log('form value:', JSON.stringify(req.body, null, 2));
    res.status(200).redirect('/');
});

app.listen(port, function() {
    console.log(`server is running on port: ${port}`);
});

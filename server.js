'use strict';

const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const port = (process.env.PORT || 3000);
require('dotenv').config();
const bodyParser = require('body-parser');
const researchersService = require("./routes/researchers-service");
const researchers = require('./routes/researchers');
const tokensService = require("./routes/tokens-service");
const tokens = require('./routes/tokens');
const baseApi = '/api/v1';
const cors = require('cors');
const logger = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerDefinition = require('./swaggerDef');
const Twitter = require('twitter');
const passport = require('passport'),
    BearerStrategy = require('passport-http-bearer').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_APP_CALLBACK
    },
    function(accessToken, refreshToken, profile, done) {
        tokensService.compareToken({
            orcid: profile.id
        }, function(err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                var userAux = {
                    orcid: profile.id,
                    token: accessToken,
                    apicalls: 0
                };
                tokensService.addWithToken(userAux,
                    function(err, result) {
                        if (err) {
                            return done(err);
                        }
                        if (result) {
                            return done(null, user);
                        }
                        else {
                            return done(err);
                        }
                    }
                );
            }
            else {
                return done(null, user, {
                    scope: 'read'
                });
            }
        });
    }
));

passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: process.env.FACEBOOK_APP_CALLBACK
    },
    function(accessToken, refreshToken, profile, done) {
        tokensService.compareToken({
            orcid: profile.id
        }, function(err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                var userAux = {
                    orcid: profile.id,
                    token: accessToken,
                    apicalls: 0
                };
                tokensService.addWithToken(userAux,
                    function(err, result) {
                        if (err) {
                            return done(err);
                        }
                        if (result) {
                            return done(null, user);
                        }
                        else {
                            return done(err);
                        }
                    }
                );
            }
            else {
                return done(null, user, {
                    scope: 'read'
                });
            }
        });
    }
));

passport.serializeUser(function(user, cb) {
    cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
});

passport.use(new BearerStrategy(
    function(token, done) {
        tokensService.compareToken({
            token: token
        }, function(err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false);
            }
            tokensService.update(token, {
                orcid: user.orcid,
                token: user.token,
                apicalls: (user.apicalls + 1)
            }, (err, numUpdates) => {
                if (err || numUpdates === 0) {
                    console.log("Error updating API Calls of token " + token);
                }
            });
            return done(null, user, {
                scope: 'read'
            });
        });
    }
));


// Used to logs all API calls
app.use(logger('dev'));

// Configuration of body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// Initialize passport
app.use(passport.initialize());

// Enable cors
app.use(cors());

app.get('/auth/facebook',
    passport.authenticate('facebook', {
        session: false,
        scope: []
    })
);

app.get('/auth/facebook/return',
    passport.authenticate('facebook', {
        failureRedirect: '/auth/facebook'
    }),
    function(req, res) {
        res.redirect("/?access_token=" + req.user.token);
    }
);

app.get('/auth/google',
    passport.authenticate('google', {
        session: false,
        scope: ['https://www.googleapis.com/auth/plus.login']
    })
);

app.get('/auth/google/return',
    passport.authenticate('google', {
        failureRedirect: '/auth/google'
    }),
    function(req, res) {
        res.redirect("/?access_token=" + req.user.token);
    }
);

// Configuration of API documentation
// Options for swagger docs
const options = {
    // Import swaggerDefinitions
    swaggerDefinition: swaggerDefinition,
    // Path to the API docs
    apis: ['./api-documentation.yml'],
};

const optionsSwaggerUi = {
    validatorUrl: null
};

const swaggerSpec = swaggerJSDoc(options);

app.use('/documentation', swaggerUi.serve, swaggerUi.setup(swaggerSpec, false, optionsSwaggerUi));

// Configuration of statics
app.use('/', express.static(path.join(__dirname + '/public')));
app.use(baseApi + '/tests', express.static(path.join(__dirname + '/public/tests.html')));
app.use(baseApi + '/integration', express.static(path.join(__dirname + '/public/integration.html')));
app.use(baseApi + '/tokens', express.static(path.join(__dirname + '/public/tokens.html')));
app.use(baseApi + '/graph', express.static(path.join(__dirname + '/public/graph.html')));
app.use('/favicon.ico', express.static('./favicon.ico'));
/**
app.use(function (req, res) {
  res.status(404).send("Sorry we can't find that :(");
});
**/
const server = http.createServer(app);
const io = require('socket.io').listen(server);

app.use(baseApi + '/researchers', researchers);
app.use(baseApi + '/tokens', tokens);


// Socket configuration
io.sockets.on('connection', (socket) => {
    console.log("User connected");

    socket.on('nr', function() {
        io.emit('newResearcher', 'nr');
    });
});

// Twitter API
var client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

app.get(baseApi + '/tweets/:query', function(req, res) {
    var query = req.params.query;
    client.get('search/tweets', {
        q: query
    }, function(error, tweets) {
        res.send(tweets);
    });
});

// Starting up the service
researchersService.connectDb((err) => {
    if (err) {
        console.log("Could not connect with MongoDB researchers");
        process.exit(1);
    }

    tokensService.connectDb((err) => {
        if (err) {
            console.log("Could not connect with MongoDB tokens");
            process.exit(1);
        }

        server.listen(port, function() {
            console.log("Server with GUI up and running!");
        });
    });
});

module.exports = app;

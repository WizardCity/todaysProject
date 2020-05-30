// server.js

// modules =================================================
var express        	= require('express'),
	path			= require('path'),
	bodyParser     	= require('body-parser'),
    methodOverride 	= require('method-override'),
    cors            = require('cors'),
    jwt             = require('jsonwebtoken'),
    mongoose		= require('mongoose'),
    cookieParser    = require('cookie-parser');

//    passport        = require('passport'),

// configuration ===========================================

var app = express();
// set our port
var port = process.env.PORT || 3000; 

//CORS Middleware
app.use(cors());
app.use(cookieParser());

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public'));


// get all data/stuff of the body (POST) parameters
// parse application/json 
app.use(bodyParser.json()); 
// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true })); 
// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override'));

//Passport Middleware
//app.use(passport.initialize());
//app.use(passport.session());

// config files
var config = require('./public/config/db');

//require('./public/config/passport')(passport);


// API Tasks ===============================================

User = require('./models/Users');
News = require('./models/News');

// Get Home Page content
app.get('/api/news', function(req, res) {
    News.getHomePage(function(err, news){
        if(err) {
            throw err;
        }
        res.json(news);
    });
});

// Add a User
app.post('/api/users', function(req, res) {
    var user = req.body;
    User.addUser(user, function(err, user){
        if(err) {
            throw err;
        }
        res.json(user);
    });
});

// Authenticate & Login User
app.post('/api/users/authenticate', function(req, res, next) {
    var username = req.body.username,
        password = req.body.password;

    User.getUserByUsername(username, function(err, user) {
        if(err) throw err;
        if(!user) {
            return res.json({success: false, msg:'User not found'});
        }

        User.comparePassword(password, user.password, function(err, isMatch) {
            if(err) throw err;
            if(isMatch){
                var token = jwt.sign(user, config.secret, {
                    expiresIn: 604800 // 1 week
                });

                res.json({
                    success: true,
                    token: 'JWT '+token,
                    user: {
                        id: user._id,
                        username: user.username,
                        email: user.email
                    }
                });
            } else {
                return res.json({success: false, msg:'Wrong Password'});
            }
        });
    });
});

app.use(function(req, res, next) {

    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if(token) {

        jwt.verify(token, config.secret, function(err, decoded) {
            if(err) {
                return res.json({ success: false, message: 'Faiiled to authenticate token.' });

            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {

        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
});

// Get the Users data
app.get('/api/users', function(req, res) {
    User.getUsers(function(err, users){
        if(err) {
            throw err;
        }
        res.json(users);
    });
});

// Checks if logged in
app.get('/api/checklogin',function(req,res){
  if (req.user)
    res.send(true);
  else
    res.send(false);
});

// Update the Users admin state
app.put('/api/users/:_id', function(req, res) {
    var id = req.params._id;
    var user = req.body;
    
    User.updateUserPriv(id, user, {}, function(err, user){
        if(err) {
            throw err;
        }
        res.json(user);
    });
});

// Delete a User
app.delete('/api/users/:_id', function(req, res) {
    var id = req.params._id;
    User.deleteUser(id, function(err, user){
        if(err) {
            throw err;
        }
        res.json(user);
    });
});

// Error handeling =========================================

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Catch unauthorised errors
app.use(function(err, req, res, next) {
	if (err.name === 'UnauthorizedError') {
		res.status(401);
		res.json({"message" : err.name + ": " + err.message});
	}
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// start app ===============================================

// startup our app at http://localhost:27017
app.listen(port);               

// shoutout to the user                     
console.log('Magic happens on port ' + port);
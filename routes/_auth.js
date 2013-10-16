var LocalStrategy = require('passport-local').Strategy;
var passport = require('passport');
var User = require("ecm-model").models.User;

passport.use(new LocalStrategy(
    function(username, password, done) {
        console.log("User %s is authenticating",username);
        User.findOne({ name: username, password: password }, function (err, user) {
            done(err, user);
        });
    }
));

exports.mount= function(app) {

    app.use(passport.initialize());
    app.use(passport.session());

    app.post('/login',passport.authenticate('local', { failureRedirect: '/login' }),loginSuccessRedirection);
    app.get('/login',login);
    app.get('/logout', logout);

    app.ensureAuthenticated=ensureAuthenticated;
};

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login')
}


function loginSuccessRedirection(req,res){
    res.redirect('/');
}

function logout(req, res){
    req.logout();
    res.redirect('/');
}

function login(req,res){
    res.render('login', { user: '',password:'' });
}


passport.serializeUser(function(user, done) {
    console.log("User %s is serializing",user.name);
    done(null, user.name);
});

passport.deserializeUser(function(id, done) {
    console.log("User %s is deserializing",id);
    User.findOne({ name: id })
        .exec(done);


});

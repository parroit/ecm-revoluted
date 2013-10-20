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

    app.post('/login',loginRedirection);
    app.get('/login',login);
    app.get('/logout', logout);

    app.ensureAuthenticated=ensureAuthenticated;
};

function loginRedirection(req,res,next){
    passport.authenticate('local',function(err, user, info){
        if (err) { return next(err); }

        if (user){
            req.logIn(user, function(err) {
                if (err) { return next(err); }
                res.redirect(req.query.redirect || '/');
            });

        } else {
            res.redirect(
                '/login'+
                    (req.query.redirect
                        ? '?redirect='+req.query.redirect
                        : '')
            );
        }

    })(req,res,next);
}

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login?redirect='+req.url);
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

var LocalStrategy = require('passport-local').Strategy;
var passport = require('passport');
var User = require("ecm-model").models.User;
var crud = require("../lib/crud");
var _ = require("lodash");

passport.use(new LocalStrategy(
    function(username, password, done) {
        console.log("User %s is authenticating",username);
        User.findOne({ name: username, password: password }, function (err, user) {
            done(err, user);
        });
    }
));

function presentHash(hash) {
    if (!hash) {
        return [];
    }
    return _.keys(hash).map(function (key) {
        return {
            key: key,
            value: hash[key]
        }
    });
}



exports.mount= function(app) {

    var renderPost = function (req, res, user) {
        if (user.errors) {
            res.render('first-login', getUserContext(user, req.flash()));
        } else {
            user.confirmed = true;
            user.save(function (err) {
                if (err) {
                    req.flash('error', req.t("data-error"));
                    renderPost(req, res, user);
                } else {
                    req.flash('info', req.t("welcome-message"));
                    res.redirect(req.query.redirect || "/profile");
                }


            });
        }

    };
    function getUserContext(user, flash) {
        return {
            user: user,
            professioni: presentHash(app.models.helpers.professioni),
            discipline: presentHash(app.models.helpers.discipline[user.professione]),
            categorie: presentHash(app.models.helpers.categorie),
            flash: flash
        };
    }
    app.ensureRegisteredUser=ensureRegisteredUser;
    app.ensureAuthenticated=ensureAuthenticated;
    app.use(passport.initialize());
    app.use(passport.session());

    app.post('/login',loginRedirection);
    app.get('/login',login);
    app.get('/logout', logout);


    crud(app,{
        authentication: app.ensureAuthenticated,
        rootUrl: "/first-login",
        findModel: function (req, next) {
            app.models.User.findOne({name: req.user.name}, next);
        },
        renderGet: function (req, res, user) {
            res.render('first-login', getUserContext(user, req.flash()));
        },
        renderPostFailure: renderPost,
        renderPostSuccess: renderPost,
        updatableBooleanProps: ['conteggio_ore'],
        updatableProps: [
            "nome", "email", "codice_fiscale",
            "prof_dip", "professione", "sponsor", "disciplina", "luogo_nascita", "data_nascita",
            "cognome", "farmacia"
        ]
    });

};

function loginRedirection(req,res,next){
    //noinspection JSUnresolvedFunction,JSUnusedLocalSymbols
    passport.authenticate('local',function(err, user, info){
        if (err) {
            return next(err);
        }

        if (user){
            //noinspection JSUnresolvedFunction
            req.logIn(user, function(err) {
                if (err) {
                    return next(err);
                }
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

function ensureRegisteredUser(req, res, next) {
    if (req.isAuthenticated()) {
        if (req.user.confirmed)
            return next();
        else
            res.redirect('/first-login?redirect='+req.url);
    } else {
        res.redirect('/login?redirect='+req.url);
    }


}

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/login?redirect='+req.url);
    }


}

function logout(req, res){
    req.logout();
    res.redirect('/');
}

//noinspection JSUnusedLocalSymbols
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

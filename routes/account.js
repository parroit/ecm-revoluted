var _ = require("lodash");


exports.mount = function (app) {
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

    function getUserContext(user, flash) {
        return {
            user: user,
            professioni: presentHash(app.models.helpers.professioni),
            discipline: presentHash(app.models.helpers.discipline[user.professione]),
            categorie: presentHash(app.models.helpers.categorie),
            flash: flash
        };
    }

    crud({
        rootUrl: "/account",
        findModel: function (req, next) {
            app.models.User.findOne({name: req.user.name}, next);
        },
        render: function (req, res, user) {
            res.render('account', getUserContext(user, req.flash()));
        },
        updatableBooleanProps: ['confirmed', 'admin', 'staff', 'conteggio_ore'],
        updatableProps: [
            "nome", "password", "email", "codice_fiscale",
            "prof_dip", "professione", "sponsor", "disciplina", "luogo_nascita", "data_nascita",
            "cognome", "farmacia"
        ]
    });

    function crud(options) {
        var allProps = _.union(options.updatableBooleanProps,options.updatableProps);

        app.get(
            options.rootUrl,
            app.ensureAuthenticated,

            function (req, res) {
                options.findModel(req, function (err, savedUser) {
                    if (err) throw err;
                    options.render(req, res, savedUser);
                });
                //res.render('account', getUserContext(req.user,req.flash()));
            }
        );

        app.post(
            options.rootUrl,
            app.ensureAuthenticated,

            function saveAccount(req, res) {
                options.findModel(req, function (err, savedUser) {
                    //app.models.User.findOne({name: req.user.name},function(err,savedUser){
                    if (err) throw err;
                    allProps.forEach(function(prop) {

                        if (options.updatableBooleanProps.indexOf(prop) > -1)
                            savedUser[prop] = req.body[prop] || false;
                        else
                            savedUser[prop] = req.body[prop] || null;


                    });

                    for (var props in req.body){
                        if (allProps.indexOf(props) == -1){
                            res.render('403', { status: 403, url: req.url, message: prop + " field not allowed in post body." });
                            return;
                        }
                    }


                    savedUser.save(function (err) {
                        if (err) {
                            req.flash('error', req.t("data-error"));
                            options.render(req, res, savedUser);
                        } else {
                            req.flash('info', req.t("successfully-saved"));
                            res.redirect(req.url);
                        }



                    });
                });


            }
        );
    }

};



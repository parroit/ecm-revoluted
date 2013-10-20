var _ = require("lodash");


exports.mount= function(app) {
    function presentHash(hash){
        if (!hash){
            return [];
        }
        return _.keys(hash).map(function(key){
            return {
                key: key,
                value: hash[key]
            }
        });
    }
    function getUserContext(user,flash) {
        return {
            user: user,
            professioni: presentHash(app.models.helpers.professioni),
            discipline: presentHash(app.models.helpers.discipline[user.professione]),
            categorie: presentHash(app.models.helpers.categorie),
            flash:flash
        };
    }

    app.get(
        '/account',
        app.ensureAuthenticated ,

        function (req, res){
            res.render('account', getUserContext(req.user,req.flash()));
        }
    );

    app.post(
        '/account',
        app.ensureAuthenticated ,

        function saveAccount(req, res){

            app.models.User.findOne({name: req.user.name},function(err,savedUser){
                if (err) throw err;
                for (var prop in req.body){
                    if (req.body.hasOwnProperty(prop))
                        savedUser[prop] = req.body[prop];
                }

                for (var boolProp in ['confirmed','admin','staff','conteggio_ore']){
                    if (req.body.hasOwnProperty(boolProp))
                        savedUser[boolProp] = req.body[boolProp] || false;
                }

                console.dir(req.body["staff"]);

                savedUser.save(function (err) {
                    if (err) {
                        req.flash('error', req.t("data-error"));
                    } else {
                        req.flash('info', req.t("successfully-saved"));
                    }


                    res.render('account',
                        getUserContext(savedUser,req.flash())

                    );
                });
            });



        }
    );
};



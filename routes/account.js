var _ = require("lodash");
var crud = require("../lib/crud");

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

    crud(app,{
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



};



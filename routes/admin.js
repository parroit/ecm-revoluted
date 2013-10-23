var _ = require("lodash");
var crud = require("../lib/crud");

exports.mount = function (app) {
    app.get('/admin', app.ensureAdmin, function (req, res) {
        res.render('admin');
    });

    app.get('/exams', app.ensureAdmin, function (req, res) {
        app.models.Exam.find({}, 'codice title', function (err, items) {
            res.json(items);
        });

    });

    crud(app,{
        authentication: app.ensureAdmin,
        model: app.models.User,
        rootUrl: "/user",
        findModel: function (req, next) {
            app.models.User.findOne({name: req.user.name}, next);
        },
        render: function (req, res, user) {
            res.render('account', getUserContext(user, req.flash()));
        },
        listFields:['name','nome','cognome','codice_fiscale','farmacia'],
        updatableBooleanProps: ['confirmed', 'admin', 'staff', 'conteggio_ore'],
        updatableProps: [
            "nome", "password", "email", "codice_fiscale",
            "prof_dip", "professione", "sponsor", "disciplina", "luogo_nascita", "data_nascita",
            "cognome", "farmacia"
        ]
    });




};



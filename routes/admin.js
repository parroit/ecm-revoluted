var _ = require("lodash");
var crud = require("../lib/crud");

exports.mount = function (app) {
    app.get('/admin', app.ensureAdmin, function (req, res) {
        res.render('admin');
    });

   /* app.get('/exams', app.ensureAdmin, function (req, res) {
        app.models.Exam.find({}, 'codice title', function (err, items) {
            res.json(items);
        });

    });*/

    app.get('/ng-templates/:tmpl', app.ensureAdmin, function (req, res) {
        res.locals.af.field = res.locals.af.fieldNg;
        res.render( req.params.tmpl);

    });

    crud(app,{
        authentication: app.ensureAdmin,
        model: app.models.User,
        rootUrl: "/user",
        instanceUrl: "/user/:name",
        findModel: function (req, next) {
            app.models.User.findOne({name: req.params.name}, next);
        },
        renderPostSuccess: function (req, res, data) {
            res.json(data);
        },
        render: function (req, res, data) {
            res.json(data);
        },
        listFields:['name','nome','cognome','codice_fiscale','farmacia'],
        updatableBooleanProps: ['confirmed', 'admin', 'staff', 'conteggio_ore'],
        updatableProps: [
            "nome", "password", "email", "codice_fiscale",
            "prof_dip", "professione", "sponsor", "disciplina", "luogo_nascita", "data_nascita",
            "cognome", "farmacia"
        ]
    });

    crud(app,{
        authentication: app.ensureAdmin,
        model: app.models.Exam,
        rootUrl: "/exam",
        instanceUrl: "/exam/:codice",
        findModel: function (req, next) {
            app.models.Exam.findOne({codice: req.params.codice}, next);
        },
        renderPostSuccess: function (req, res, data) {
            res.json(data);
        },
        render: function (req, res, data) {
            res.json(data);
        },
        listFields:['codice','title'],
        updatableBooleanProps: ['closed'],
        updatableProps: [
            'title', 'target','finality','description','closed',
            ,'data_inizio','data_fine',
            ,'punti','durata_ore','originalManualFilename','actualManualFilename'


        ]
    });




};



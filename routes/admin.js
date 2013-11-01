var _ = require("lodash");
var crud = require("../lib/crud");

exports.mount = function (app) {
    app.get('/admin', app.ensureAdmin, function (req, res) {
        res.render('admin');
    });

    app.get('/ng-templates/:tmpl', app.ensureAdmin, function (req, res) {
        res.locals.af.field = res.locals.af.fieldNg;
        res.render( req.params.tmpl, { layout: false });

    });

    //users
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

    //exams-users
    crud(app,{
        authentication: app.ensureAdmin,
        model: app.models.TakenExam,
        rootUrl: "/exams-users/:codiceEsame",
        instanceUrl: "/exams-users/:codiceEsame/:name",
        findModel: function (req, next) {
            app.models.User.findOne({name: req.params.name}, next);
        },
        buildFilter: function(req,filter){
            return {
                "$and":[
                   {exam_id: req.params.codiceEsame},
                    filter
                ]
            };
        },
        buildItemFromResult: function(req,item){
            return item;
        },
        renderPostSuccess: function (req, res, data) {
            res.json(data);
        },
        render: function (req, res, data) {
            res.json(data);
        },
        listFields:['user_id','user_nome','user_cognome','user_codice_fiscale','user_farmacia'],
        updatableBooleanProps: ['confirmed', 'admin', 'staff', 'conteggio_ore'],
        updatableProps: [
            "nome", "password", "email", "codice_fiscale",
            "prof_dip", "professione", "sponsor", "disciplina", "luogo_nascita", "data_nascita",
            "cognome", "farmacia"
        ]
    });

    //exams
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



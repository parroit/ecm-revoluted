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

    app.get('/users', app.ensureAdmin, function (req, res) {
        var page = parseInt(req.query.page) || 0;
        var sort = req.query.sort || 'name';
        var sortDirection = req.query.sortDirection || 'asc';
        var PAGE_LENGTH = 15;
        var filter;
        var value;
        if (req.query.filter){
            value =req.query.filter;
            filter= {
                "$or":[
                    {name: new RegExp(value, 'i')},
                    {nome: new RegExp(value, 'i')},
                    {cognome: new RegExp(value, 'i')},
                    {codice_fiscale: new RegExp(value, 'i')},
                    {farmacia: new RegExp(value, 'i')},
                    {email: new RegExp(value, 'i')}


                ]
            }
        } else {
            filter= {};
            value="";
        }
        app.models.User.count(filter, function (err, count) {
            var query = app.models.User.find(filter, 'name nome cognome codice_fiscale farmacia', { skip: page * PAGE_LENGTH, limit: PAGE_LENGTH })
            var sorter = {};
            sorter[sort] = sortDirection;
            query.sort(sorter)
                .find(function (err, items) {
                    if (value){
                        for(var i= 0, l=items.length; i<l; i++){
                            ['name','nome','cognome','codice_fiscale','farmacia'].forEach(function(prop){
                                var regExp = new RegExp("(" + value + ")", 'ig');
                                var coded = '<span class="search-term">$1</span>';
                                items[i][prop]=items[i][prop] && items[i][prop].replace(regExp, coded);
                            });
                        }
                    }

                    res.json( {
                        items: items,
                        currPage: page,
                        totalPages: parseInt(count / PAGE_LENGTH)
                    });
                });
        });


    });


};



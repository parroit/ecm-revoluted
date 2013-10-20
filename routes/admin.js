var _ = require("lodash");
var crud = require("../lib/crud");

exports.mount = function (app) {
    app.get('/admin',app.ensureAdmin,function(req,res){
        res.render('admin');
    });



};



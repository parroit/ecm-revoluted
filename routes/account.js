
var Aweforms = require("./aweforms").Aweforms;

exports.mount= function(app) {
    app.get('/account',app.ensureAuthenticated ,account);
    app.post('/account',app.ensureAuthenticated ,function saveAccount(req, res){

        app.models.User.findOne({name: req.user.name},function(err,savedUser){
            if (err) throw err;
            for (var prop in req.body){
                savedUser[prop] = req.body[prop];
            }


            savedUser.save(function (err) {
                if (err) {
                    req.flash('flash', err.toString())
                } else {

                }

                var aweforms = new Aweforms("user");
                res.render('account', {
                    user: savedUser,
                    flash: req.flash('flash'),
                    af: aweforms
                });
            });
        });



    });
};

function account(req, res){
  res.render('account', { user: req.user ,af:new Aweforms("user") });
}


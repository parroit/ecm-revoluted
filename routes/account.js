


exports.mount= function(app) {
    app.get('/account',app.ensureAuthenticated ,account);
    app.post('/account',app.ensureAuthenticated ,function saveAccount(req, res){

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
                    req.flash('flash', err.toString())
                } else {

                }


                res.render('account', {
                    user: savedUser,
                    flash: req.flash('flash')

                });
            });
        });



    });
};

function account(req, res){
  res.render('account', { user: req.user });
}


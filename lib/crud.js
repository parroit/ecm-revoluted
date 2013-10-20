var _ = require("lodash");

module.exports = function(app,options) {
    var allProps = _.union(options.updatableBooleanProps,options.updatableProps);
    options.renderGet = options.renderGet || options.render;
    options.renderPost = options.renderPost || options.render;
    options.renderPostFailure = options.renderPostFailure || options.renderPost;
    options.renderPostSuccess = options.renderPostSuccess || function(req,res,user){
        res.redirect(req.url);
    };
    options.authentication = options.authentication || app.ensureRegisteredUser;
    app.get(
        options.rootUrl,
        options.authentication,

        function (req, res) {
            options.findModel(req, function (err, savedUser) {
                if (err) throw err;
                options.renderGet(req, res, savedUser);
            });

        }
    );

    app.post(
        options.rootUrl,
        options.authentication,

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
                        options.renderPostFailure(req, res, savedUser);
                    } else {
                        req.flash('info', req.t("successfully-saved"));
                        options.renderPostSuccess(req, res, savedUser);

                    }



                });
            });


        }
    );
};

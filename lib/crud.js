var _ = require("lodash");

module.exports = function (app, options) {
    var allProps = _.union(options.updatableBooleanProps, options.updatableProps);
    options.renderGet = options.renderGet || options.render;
    options.renderPost = options.renderPost || options.render;
    options.renderList = options.renderList || options.render;

    options.renderPostFailure = options.renderPostFailure || options.renderPost;
    options.renderPostSuccess = options.renderPostSuccess || function (req, res, data) {
        res.redirect(req.url);
    };
    options.authentication = options.authentication || app.ensureRegisteredUser;
    options.listFields = options.listFields || allProps;
    options.instanceUrl = options.instanceUrl || options.rootUrl;

    options.buildFilter = options.buildFilter || function (req, filter) {
        return filter;
    };
    options.buildItemFromResult = options.buildItemFromResult || function (req, item) {
        return item;
    };


    app.get(
        options.rootUrl + '/list',
        options.authentication,
        function (req, res) {
            var page = parseInt(req.query.page) || 0;
            var sort = req.query.sort || options.listFields[0];
            var sortDirection = req.query.sortDirection || 'asc';
            var PAGE_LENGTH = 15;
            var filter;
            var value;
            if (req.query.filter) {
                value = req.query.filter;

                filter = {"$or": []};
                options.listFields.forEach(function (prop) {
                    var propFilter = {};
                    propFilter[prop] = new RegExp(value, 'i');
                    filter.$or.push(propFilter);
                });

            } else {
                filter = {};
                value = "";
            }

            var criteria = options.buildFilter(req, filter);
            options.model.count(criteria, function (err, count) {

                var query = options.model.find(criteria, options.listFields.join(" "), { skip: page * PAGE_LENGTH, limit: PAGE_LENGTH });
                var sorter = {};
                sorter[sort] = sortDirection;
                var results = [];
                query.sort(sorter)
                    .find(function (err, items) {


                        for (var i = 0, l = items.length; i < l; i++) {

                            var item = options.buildItemFromResult(req, items[i]);
                            if (value) {
                                options.listFields.forEach(function (prop) {
                                    var regExp = new RegExp("(" + value + ")", 'ig');
                                    var coded = '<span class="search-term">$1</span>';
                                    item[prop] = item[prop] && item[prop].replace(regExp, coded);
                                });

                            }
                            results.push(item);
                        }

                        options.renderList(req, res, {
                            items: results,
                            currPage: page,
                            totalPages: parseInt(count / PAGE_LENGTH)
                        });

                    });


            });
        }
    );


    app.get(
        options.instanceUrl,
        options.authentication,

        function (req, res) {
            options.findModel(req, function (err, savedUser) {
                if (err) throw err;
                options.renderGet(req, res, savedUser);
            });

        }
    );

    app.post(
        options.instanceUrl,
        options.authentication,

        function saveAccount(req, res) {
            options.findModel(req, function (err, savedUser) {
                //app.models.User.findOne({name: req.user.name},function(err,savedUser){
                if (err) throw err;
                allProps.forEach(function (prop) {

                    if (options.updatableBooleanProps.indexOf(prop) > -1)
                        savedUser[prop] = req.body[prop] || false;
                    else
                        savedUser[prop] = req.body[prop] || null;


                });

                for (var props in req.body) {
                    if (allProps.indexOf(props) == -1) {
                        res.render('403', { status: 403, url: req.url, message: props + " field not allowed in post body." });
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
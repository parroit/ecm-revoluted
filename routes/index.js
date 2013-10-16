
/*
 * GET home page.
 */

exports.mount= function(app) {
    app.get('/', index);
};

function index(req, res){
  res.render('index', { title: 'Express' });
}

/*
 * GET users listing.
 */

exports.mount= function(app) {
    app.get('/users', list);
};

function list(req, res){
  res.send("respond with a resource");
}
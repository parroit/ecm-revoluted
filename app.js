
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var fs = require("fs");
var app = express();

// all environments
app.set('port', 80);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.engine ('html', require('hogan-express'));
app.set ('layout', 'layout');

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
var flash = require('connect-flash');
app.use(flash());

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
  app.disable('view achce');
}

var routes = fs.readdirSync("routes");
routes.sort();
routes.forEach(function(routePath){
    console.log("Importing route "+routePath);
    try{
        var route = require('./routes/'+routePath);
        route.mount(app);
    } catch (error){
        console.log("Cannot mount route %s. %s",routePath,error);
    }

});


app.use(app.router);
app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));


require("ecm-model").connect('mongodb://localhost/ecm',function (schemas, models){
    app.models = models;
    app.schemas = schemas;
    console.log('Mongodb connection ready');
    http.createServer(app).listen(app.get('port'), function(){
        console.log('Ecm revoluted is ready and listening on port ' + app.get('port'));
    });

});

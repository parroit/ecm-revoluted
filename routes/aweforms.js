var cheerio = require('cheerio');


exports.Aweforms = function(){

};


exports.init = function (req, res, next) {
    // mustache helper
    res.locals.af = new exports.Aweforms();

    next();
};


exports.Aweforms.prototype.field = function(){
    var self = this;
    return function(text, render) {
        var $ = cheerio.load(text);
        var $input = $("input");

        var qualifiedId =  $input.attr("id");
        var idParts = qualifiedId.split(".");
        $input
            .attr("name", idParts[1])
            .attr("value", "{{" + qualifiedId + "}}");

        var errors = this[idParts[0]].errors;
        var fieldError = errors && errors[idParts[1]]  && errors[idParts[1]].type;

        return [
            '<div class="field ',(fieldError ? "text-error":""),'">',
            '<label for="', qualifiedId, '">{{#t}}', qualifiedId,'{{/t}}</label>',
            '<div>',
            $.html(),
            '<span class="error">{{#t}}',fieldError,'{{/t}}</span>',
            '</div>',
            '</div>'
        ].join("");
    }
};


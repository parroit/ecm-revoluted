var cheerio = require('cheerio');
var _ = require('lodash');

exports.newInstance = function(i18n){
    var aweforms = new Aweforms(i18n);
    aweforms.field = _.bind(aweforms.field,aweforms);
    return  aweforms;
};

var Aweforms = function(i18n){

    if (i18n){
        console.dir("custom i18n");
        this.i18n = i18n;

    } else {
        console.dir("require i18n");
        this.i18n = require("i18n");
        this.i18n.configure({
            locales: ['it'],
            directory: __dirname + '/locales'
        });

    }
};


exports.init = function (req, res, next) {
    // mustache helper
    res.locals.af =exports.newInstance();

    next();
};


function getFieldId($input, text) {
    var qualifiedId = $input.attr("id");

    if (!qualifiedId) {
        throw new Error("id not defined in field " + text);
    }

    var idParts = qualifiedId.split(".");

    var fieldName = idParts[1];
    if (!fieldName) {
        throw new Error("id should be fully qualified in field " + text);
    }

    var modelName = idParts[0];
    if (!modelName) {
        throw new Error("id should be fully qualified in field " + text);
    }

    return {
        modelName: modelName,
        name: fieldName,
        qualifiedId:qualifiedId
    };
}

function getError(fieldError) {
    var error;
    if (fieldError) {
        if (fieldError.indexOf("!") == 0) {
            error = eval('[' + fieldError.substring(1) + ']');

        } else {
            error = [fieldError];
        }
    } else {
        error = [""];
    }
    return error;
}
Aweforms.prototype.field = function(){
    var self = this;

    return function(text, render) {

        var $ = cheerio.load(text);
        var $input = $("input");

        var field = getFieldId($input, text);

        var modelValue = this[field.modelName];
        var fieldValue = modelValue[field.name];

        $input.attr("name", field.name);

        if ($input.attr("type").toLowerCase() == "checkbox") {

            if (fieldValue) {
                $input.attr("checked", "checked")
            }
        } else {
            $input.attr("value",fieldValue);
        }

        var errors = modelValue.errors;
        var fieldError = errors && errors[field.name] && errors[field.name].type;

        var error = getError(fieldError);
        //console.log("field.qualifiedId: "+field.qualifiedId);
        return [
            '<div class="field ', (fieldError ? "text-error" : ""), '">',
            '<label for="', field.qualifiedId, '">', self.i18n.__.call(this,field.qualifiedId), '</label>',
            '<div>',
            $.html(),
            '<span class="error">', self.i18n.__.apply(this, error), '</span>',
            '</div>',
            '</div>'
        ].join("");
    }
};


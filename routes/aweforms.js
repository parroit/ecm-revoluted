var cheerio = require('cheerio');
exports.Aweforms = function(modelName){
    this.modelName = modelName;
};


exports.Aweforms.prototype.field = function(){
    var self = this;
    return function(text, render) {
        var $ = cheerio.load(text);
        var $input = $("input");
        var id = $input.attr("name");

        $input
            .attr("id", id)
            .attr("value", "{{" + self.af.modelName + "." + id + "}}");

        return [
            '<div class="field">',
            '<label for="', id, '">Nome</label>',
            '<div>',
            $.html(),
            '<span class="error">{{', self.af.modelName, '.errors.', id, '.message}}</span>',
            '</div>',
            '</div>'
        ].join("");
    }
};

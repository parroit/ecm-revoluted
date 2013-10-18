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

        var qualifiedId = self.af.modelName + "." + id;
        $input
            .attr("id", qualifiedId)
            .attr("value", "{{" + qualifiedId + "}}");

        return [
            '<div class="field">',
            '<label for="', qualifiedId, '">Nome</label>',
            '<div>',
            $.html(),
            '<span class="error">{{', self.af.modelName, '.errors.', qualifiedId, '.message}}</span>',
            '</div>',
            '</div>'
        ].join("");
    }
};

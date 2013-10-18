'use strict';

var aweformsModule = require('../routes/aweforms.js');

var expect = require('chai').expect;

var hogan = require("hogan-express/node_modules/hogan.js");

require('chai').should();


describe('aweforms', function () {
    describe("module", function () {
        it("should load", function () {
            expect(aweformsModule).not.to.be.equal(null);
            expect(aweformsModule).to.be.a('object');

        });
    });

    var Aweforms = aweformsModule.Aweforms;
    describe("field", function () {
        it("wrap input in bt horizontal form", function () {

            var template = hogan.compile('{{#af.field}}<input type="text" name="test">{{/af.field}}');
            var aw = new Aweforms("user");

            var result =  template.render({
                user: {
                    test:"ciao"
                },
                af: aw
            });

            expect(result).to.be.equal(
                '<div class="field">'+
                    '<label for="user.test">'+
                        'Nome'+
                    '</label>'+
                    '<div>'+
                        '<input type="text" name="test" id="user.test" value="ciao">'+
                        '<span class="error"></span>'+
                    '</div>'+
                '</div>'
            );


        });
    });
});

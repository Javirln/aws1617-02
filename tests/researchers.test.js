'use strict';

var chai = require('chai');
chai.use(require('chai-things'));
var expect = chai.expect;

describe('Fist test', () => {
    it('should pass the addition of two numbers', (done) => {
        const sum = 1 + 3;
        
        expect(sum).to.be.equal(4);
        expect(sum).to.be.not.equal(3);
        done();
    });
    
});

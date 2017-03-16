'use strict';

const chai = require('chai');
chai.use(require('chai-things'));
const expect = chai.expect;

describe('Fist test', () => {
    it('should pass the addition of two numbers', (done) => {
        const sum = 1 + 3;
        
        expect(sum).to.be.equal(4);
        expect(sum).to.be.not.equal(4);
        done();
    });
});
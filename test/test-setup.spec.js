import sinon from "sinon";
import chai from 'chai';
import sinonChai from 'sinon-chai';
process.env.DB_PASS = 'WHATEVERYOUWANT';
process.env.DB_USER = 'ALSOUPTOYOU';
process.env.DEFAULT_RATING = '1400';

before(function () {
    chai.use(sinonChai)
});

beforeEach(function () {
    this.sandbox = sinon.createSandbox()
});

afterEach(function () {
    this.sandbox.restore()
});
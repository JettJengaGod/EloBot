import sinon from "sinon";
import chai from 'chai';
import sinonChai from 'sinon-chai';

before(function () {
    chai.use(sinonChai)
});

beforeEach(function () {
    this.sandbox = sinon.createSandbox()
});

afterEach(function () {
    this.sandbox.restore()
});
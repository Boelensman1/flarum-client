// comparison lib
const chai = require('chai');
chai.use(require('chai-datetime'));
chai.use(require('chai-things'));
chai.use(require('chai-as-promised'));

const expect = chai.expect;
chai.config.includeStack = true;

const settings = require('./settings.json');
const FlarumClient = require('../');

describe('getUser', () => {
  let flarumClient;
  beforeEach(() => {
    flarumClient = new FlarumClient(settings);
  });

  it('Should find the user', () => {
    const getUserPromise = flarumClient.getUser('WBoelens');
    return expect(getUserPromise).to.eventually.have.property('id');
  });
});

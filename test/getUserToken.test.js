// comparison lib
const chai = require('chai');
chai.use(require('chai-datetime'));
chai.use(require('chai-things'));
chai.use(require('chai-as-promised'));

const expect = chai.expect;
chai.config.includeStack = true;

const settings = require('./settings.json');
const FlarumClient = require('../');

describe('getUserToken', () => {
  let flarumClient;
  beforeEach(() => {
    flarumClient = new FlarumClient(settings);
  });

  it('Should refuse giving a token', () => {
    const getUserToken = flarumClient.getUserToken;
    const userTokenPromise = getUserToken('WrongName', 'WrongPass');
    return expect(userTokenPromise).to.rejectedWith({});
  });

  it('Should give a token', () => {
    const userTokenPromise = flarumClient.getUserToken(
      settings.adminUsername,
      settings.adminPassword
    );
    return expect(userTokenPromise).to.eventually.have.property('token')
      .and.to.have.length(40);
  });
});

// comparison lib
const chai = require('chai');
chai.use(require('chai-datetime'));
chai.use(require('chai-things'));
chai.use(require('chai-as-promised'));

const expect = chai.expect;
chai.config.includeStack = true;

const settings = {
  apiUrl: 'http://community.space-s.nl/forum/api',
  adminUsername: 'Server',
  adminPassword: 'tJcf4acXLKgb',
};
const flarumClient = require('../').init(settings);

const getUserToken = flarumClient.getUserToken;

describe('flarumClient', () => {
  describe('getUserToken', () => {
    it('Should refuse giving a token', () => {
      const userTokenPromise = getUserToken('WrongName', 'WrongPass');
      return expect(userTokenPromise).to.rejectedWith({});
    });

    it('Should give a token', () => {
      const userTokenPromise = getUserToken(
        settings.adminUsername,
        settings.adminPassword
      );
      return expect(userTokenPromise).to.eventually.have.property('token')
        .and.to.have.length(40);
    });
  });
});

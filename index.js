/**
 * Constructor for the flarum client
 *
 * @param {object} settings The config object, should look like this
 * {
 *   "apiUrl": "http://example.org/api ",
 *   "adminUsername": "username",
 *   "adminPassword": "password"
 * }
 * @param {object} logger Optional, a bunyan logger object
 * @returns {object} The flarumclient instance
 */
function FlarumClient(settings, logger) { // eslint-disable-line require-jsdoc
  // save config
  this.settings = settings;

  if (logger) {
    this.logger = logger;
  } else {
    /* eslint-disable no-console */
    this.logger = {
      error: console.error,
      debug: () => {},
      info: () => {},
    };
    /* eslint-enable */
  }
}

// class methods
FlarumClient.prototype = {
  createUser: require('./lib/createUser'),
  getUserToken: require('./lib/getUserToken'),
  getUser: require('./lib/getUser'),
  patchUser: require('./lib/patchUser'),
  deleteUser: require('./lib/deleteUser'),
  changeAvatarUser: require('./lib/changeAvatarUser'),
  getAuthorization: require('./lib/util/getAuthorization'),
};

module.exports = FlarumClient;

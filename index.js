const flarumClient = { init }; // eslint-disable-line no-use-before-define

/**
 * Initialise the flarum client, overwrites flarum client therefore after
 * running init once you can just require flarumClient
 *
 * @param {object} config The config object, should look like this
 * {
 *   "apiUrl": "http://example.org/api ",
 *   "adminUsername": "username",
 *   "adminPassword": "password"
 * }
 * @param {object} loggerConfig Optional, a bunyan logger object
 * @returns {object} The flarumclient instance
 */
function init(config, loggerConfig) {
  const createUser = require('./lib/createUser');
  const getUserToken = require('./lib/getUserToken');
  const patchUser = require('./lib/patchUser');
  const deleteUser = require('./lib/deleteUser');
  const getUser = require('./lib/getUser');
  const changeAvatarUser = require('./lib/changeAvatarUser');

  let logger;
  if (loggerConfig) {
    logger = loggerConfig;
  } else {
    /* eslint-disable no-console */
    logger = {
      error: console.error,
      debug: () => {},
      info: () => {},
    };
    /* eslint-enable */
  }

  flarumClient.createUser = createUser.bind(null, config, logger);
  flarumClient.getUserToken = getUserToken.bind(null, config, logger);
  flarumClient.patchUser = patchUser.bind(null, config, logger);
  flarumClient.deleteUser = deleteUser.bind(null, config, logger);
  flarumClient.getUser = getUser.bind(null, config, logger);
  flarumClient.changeAvatarUser = changeAvatarUser.bind(null, config, logger);
  return flarumClient;
}

module.exports = flarumClient;

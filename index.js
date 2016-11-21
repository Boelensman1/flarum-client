const flarumClient = {
  init: (config, loggerConfig) => {
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
      logger = {
        debug: () => {},
        info: () => {},
      };
    }

    flarumClient.createUser = createUser.bind(null, config, logger);
    flarumClient.getUserToken = getUserToken.bind(null, config, logger);
    flarumClient.patchUser = patchUser.bind(null, config, logger);
    flarumClient.deleteUser = deleteUser.bind(null, config, logger);
    flarumClient.getUser = getUser.bind(null, config, logger);
    flarumClient.changeAvatarUser = changeAvatarUser.bind(null, config, logger);
    return flarumClient;
  },
};

module.exports = flarumClient;

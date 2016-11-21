const request = require('superagent');
const q = require('q');

const getUser = require('../').getUser;
const getAuthorization = require('./util/getAuthorization');

/**
 * Delete a user on the flarum forums
 *
 * @param {object} settings The flarum settings
 * @param {object} logger Logger object, from restify
 * @param {string} userName The userName of the user
 * @returns {Promise} Promise that resolves when done
 */
function deleteUser(settings, logger, userName) {
  return new q.Promise((resolve) => {
    logger.debug(`Deleting user ${userName}`);
    getAuthorization(logger).then((auth) => {
      logger.debug('Got authorization');

      // get the user id
      resolve(getUser(userName).then((user) => (
        new q.Promise((resolve2, reject) => {
          const userId = user.id;
          request
            .delete(`${settings.apiUrl}/users/${userId}`)
            .set('Authorization', auth)
            .set('Accept', 'application/json')
            .end((err, res) => {
              if (err) {
                logger.error('Error while deleting user', res.body);
                reject(res.body);
              } else {
                logger.debug('Deleted user', userName);
                resolve2();
              }
            });
        })
      )));
    });
  });
}

module.exports = deleteUser;

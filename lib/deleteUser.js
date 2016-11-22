const request = require('superagent');
const q = require('q');

const getAuthorization = require('./util/getAuthorization');

/**
 * Delete a user on the flarum forums
 *
 * @param {object} settings The flarum settings
 * @param {object} logger Logger object, from restify
 * @param {string} userId The id the user
 * @returns {Promise} Promise that resolves when done
 */
function deleteUser(settings, logger, userId) {
  logger.debug(`Deleting user ${userId}`);
  return getAuthorization(settings, logger).then((auth) => {
    logger.debug('Got authorization');
    request
      .delete(`${settings.apiUrl}/users/${userId}`)
      .set('Authorization', auth)
      .set('Accept', 'application/json')
      .end((err, res) => (
        new q.Promise((resolve, reject) => {
          if (err) {
            logger.error('Error while deleting user', res.body);
            reject(res.body);
          } else {
            logger.debug('Deleted user', userId);
            resolve();
          }
        })
      ));
  });
}

module.exports = deleteUser;

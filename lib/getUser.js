const request = require('superagent');
const q = require('q');

const getAuthorization = require('./util/getAuthorization');

/**
 * Get a user by its name on the flarum forums
 *
 * @param {object} settings The flarum settings
 * @param {object} logger Logger object, from restify
 * @param {string} userName The userName of the user
 * @returns {Promise} Promise that resolves when done
 */
function getUser(settings, logger, userName) {
  return new q.Promise((resolve, reject) => {
    getAuthorization(settings, logger).then((auth) => {
      logger.debug('Got authorization');
      request
        .get(`${settings.apiUrl}/users/${userName}`)
        .set('Accept', 'application/json')
        .set('Authorization', auth)
        .end((err, res) => {
          if (err) {
            logger.error('Error while getting user', res.body);
            reject(res.body);
          } else {
            resolve(res.body.data);
          }
        });
    });
  });
}

module.exports = getUser;

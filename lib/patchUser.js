const request = require('superagent');
const q = require('q');

const getAuthorization = require('./util/getAuthorization');
const addContainer = require('./util/addContainer');

/**
 * Patch a user on the flarum forums
 *
 * @param {object} settings The flarum settings
 * @param {object} logger Logger object, from restify
 * @param {string} data What to update
 * @param {number} forumAccountId The id of the user on the forum to update
 * @returns {Promise} Promise that resolves when done
 */
function patchUser(settings, logger, data, forumAccountId) {
  logger.debug('Patching user');
  return new q.Promise((resolve, reject) => {
    getAuthorization(settings, logger).then((auth) => {
      logger.debug('Got authorization');
      logger.debug('Sending request');
      request
        .patch(`${settings.apiUrl}/users/${forumAccountId}`)
        .send(addContainer(data))
        .set('Authorization', auth)
        .set('Accept', 'application/json')
        .end((err, res) => {
          if (err) {
            logger.error('Error while patching user', res.body);
            reject(res.body);
          } else {
            logger.debug('Pathed user', forumAccountId);
            resolve(res.body.data);
          }
        });
    });
  });
}

module.exports = patchUser;

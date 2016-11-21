const request = require('superagent');
const q = require('q');

const getAuthorization = require('./util/getAuthorization');

/**
 * Change the avatar of a user on the flarum forums
 *
 * @param {object} settings The flarum settings
 * @param {object} logger Logger object, from restify
 * @param {string} file of a file object that we will upload
 * @param {number} forumAccountId The id of the user on the forum to update
 * @returns {Promise} Promise that resolves when done
 */
function changeAvatarUser(settings, logger, file, forumAccountId) {
  return new q.Promise((resolve, reject) => {
    getAuthorization(settings, logger).then((auth) => {
      logger.debug('Got authorization');
      request
        .post(`${settings.apiUrl}/users/${forumAccountId}/avatar`)
        .attach('avatar', file.get('location'))
        .set('Authorization', auth)
        .set('Accept', 'application/json')
        .end((err, res) => {
          if (err) {
            logger.error('Error while pathing user', res.body);
            reject(res.body);
            return;
          }
          logger.debug('Pathed user', forumAccountId);
          resolve(res.body.data);
        });
    });
  });
}

module.exports = changeAvatarUser;

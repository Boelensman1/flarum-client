const request = require('superagent');
const q = require('q');

const addContainer = require('./util/addContainer');

/**
 * Patch a user on the flarum forums
 *
 * @memberof FlarumClient
 * @param {string} data What to update
 * @param {number} userId The id of the user on the forum to update
 * @returns {Promise} Promise that resolves when done
 */
function patchUser(data, userId) {
  this.logger.debug('Patching user');
  return new q.Promise((resolve, reject) => {
    this.getAuthorization().then((auth) => {
      this.logger.debug('Got authorization');
      this.logger.debug('Sending request');
      request
        .patch(`${this.settings.apiUrl}/users/${userId}`)
        .send(addContainer(data))
        .set('Authorization', auth)
        .set('Accept', 'application/json')
        .end((err, res) => {
          if (err) {
            this.logger.error('Error while patching user', res.body);
            reject(res.body);
          } else {
            this.logger.debug('Pathed user', userId);
            resolve(res.body.data);
          }
        });
    });
  });
}

module.exports = patchUser;

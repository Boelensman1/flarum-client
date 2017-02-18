const request = require('superagent');
const q = require('q');

/**
 * Change the avatar of a user on the flarum forums
 *
 * @param {string} file of a file object that we will upload
 * @param {number} forumAccountId The id of the user on the forum to update
 * @returns {Promise} Promise that resolves when done
 */
function changeAvatarUser(file, forumAccountId) {
  return new q.Promise((resolve, reject) => {
    this.getAuthorization().then((auth) => {
      this.logger.debug('Got authorization');
      request
        .post(`${this.settings.apiUrl}/users/${forumAccountId}/avatar`)
        .attach('avatar', file.get('location'))
        .set('Authorization', auth)
        .set('Accept', 'application/json')
        .end((err, res) => {
          if (err) {
            this.logger.error('Error while pathing user', res.body);
            reject(res.body);
            return;
          }
          this.logger.debug('Pathed user', forumAccountId);
          resolve(res.body.data);
        });
    });
  });
}

module.exports = changeAvatarUser;

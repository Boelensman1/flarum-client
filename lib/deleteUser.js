const request = require('superagent');
const q = require('q');

/**
 * Delete a user on the flarum forums
 *
 * @param {string} userId The id the user
 * @returns {Promise} Promise that resolves when done
 */
function deleteUser(userId) {
  return new q.Promise((resolve, reject) => {
    this.logger.debug(`Deleting user ${userId}`);
    this.getAuthorization().then((auth) => {
      this.logger.debug('Got authorization');
      request
        .delete(`${this.settings.apiUrl}/users/${userId}`)
        .set('Authorization', auth)
        .set('Accept', 'application/json')
        .end((err, res) => {
          if (err) {
            this.logger.error('Error while deleting user', res.body);
            reject(res.body);
          } else {
            this.logger.debug('Deleted user', userId);
            resolve();
          }
        });
    });
  });
}

module.exports = deleteUser;

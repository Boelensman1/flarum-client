const request = require('superagent');
const q = require('q');

/**
 * Get a user by its name on the flarum forums
 *
 * @param {string} userName The userName of the user
 * @returns {Promise} Promise that resolves when done
 */
function getUser(userName) {
  return new q.Promise((resolve, reject) => {
    this.getAuthorization().then((auth) => {
      this.logger.debug('Got authorization');
      request
        .get(`${this.settings.apiUrl}/users/${userName}`)
        .set('Accept', 'application/json')
        .set('Authorization', auth)
        .end((err, res) => {
          if (err) {
            this.logger.error('Error while getting user', res.body);
            reject(res.body);
          } else {
            resolve(res.body.data);
          }
        });
    });
  });
}

module.exports = getUser;

const request = require('superagent');
const q = require('q');

/**
 * Get a token for a user
 *
 * @param {object} settings The flarum settings
 * @param {object} logger Logger object, from restify
 * @param {string} username The username of the user
 * @param {string} password The password of the user
 * @returns {Promise} Promise that resolves to {token, userId} when done
 */
function getUserToken(settings, logger, username, password) {
  return new q.Promise((resolve, reject) => {
    const data = {
      identification: username,
      password,
    };

    request
    .post(`${settings.apiUrl}/token`)
    .send(data)
    .set('Accept', 'application/json')
    .end((err, res) => {
      if (err) {
        /* istanbul ignore if */
        if (res.statusCode !== 401) {
          logger.error(err, 'Error while getting flarum token:');
        } else {
          logger.info('Getting user token denied for', username);
        }
        reject(res.body);
      } else {
        resolve({ token: res.body.token, userId: res.body.userId });
      }
    });
  });
}

module.exports = getUserToken;

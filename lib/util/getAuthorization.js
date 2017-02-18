const request = require('superagent');
const q = require('q');
const NodeCache = require('node-cache');
// auth token normally gets expired by flarum after 3600 seconds (1hr)
// see github.com/flarum/core/blob/master/src/Api/Controller/TokenController.php
const tokenCache = new NodeCache({ stdTTL: 3000, checkperiod: 400 });

/**
 * Create a user on the flarum forums
 *
 * @param {object} settings The flarum settings
 * @param {object} logger Logger object, from restify
 * @returns {Promise} Promise that resolves when done
 */
function getFlarumToken(settings, logger) {
  return new q.Promise((resolve, reject) => {
    const data = {
      identification: settings.adminUsername,
      password: settings.adminPassword,
    };

    request
    .post(`${settings.apiUrl}/token`)
    .send(data)
    .set('Accept', 'application/json')
    .end((err, res) => {
      if (err) {
        logger.error(err, 'Error while getting flarum token:');
        return reject(err);
      }
      return resolve(res.body.token);
    });
  });
}

/**
 * Get the authorization for a flarum request,
 * either gets it from memory or directly
 *
 * @returns {Promise} Promise that resolves to the authentication
 */
function getAuthorization() {
  return new q.Promise((resolve, reject) => {
    tokenCache.get('token', (err, tokenFromCache) => {
      if (!err && tokenFromCache !== undefined) {
        this.logger.info('Used old token.');
        return resolve(`Token ${tokenFromCache}`);
      }

      // apperently the key was not found
      return resolve(getFlarumToken(this.settings, this.logger)
        .then((newToken) => {
          this.logger.info('Set new token.');
          tokenCache.set('token', newToken);
          return `Token ${newToken}`;
        })
      );
    });
  });
}

module.exports = getAuthorization;

const request = require('superagent');
const q = require('q');

const getAuthorization = require('./util/getAuthorization');
const addContainer = require('./util/addContainer');
const patchUser = require('./patchUser');
const getUserToken = require('./getUserToken');

/**
 * Create a user on the flarum forums
 *
 * @param {object} settings The flarum settings
 * @param {object} logger Logger object, from restify
 * @param {string} username The username of the user
 * @param {string} password The password of the user
 * @param {string} email The email of the user
 * @param {string} bio The bio that is placed on the profile page of the user
 * @returns {Promise} Promise that resolves when done with the object:
 *                    {id: newUserId, token: loginToken}
 */
function createUser(settings, logger, username, password, email, bio) {
  logger.debug('Creating user');
  return new q.Promise((resolve, reject) => {
    getAuthorization(settings, logger).then((auth) => {
      logger.debug('Got authorization');
      let data = {
        username,
        password,
        email,
        isActivated: true,
      };

      data = addContainer(data);

      logger.debug('sending request');

      request
        .post(`${settings.apiUrl}/users`)
        .send(data)
        .set('Authorization', auth)
        .set('Accept', 'application/json')
        .end((err, res) => {
          if (err) {
            if (process.env.NODE_ENV !== 'test') {
              logger.error('Error while creating user', res.body);
            }
            reject(res.body);
          } else {
            logger.debug('Created user', username);
            // for some reason the bio cannot be set on creation
            // so we do it now
            logger.debug('Will now patch in the bio and log in');
            const userId = res.body.data.id;
            const promises = [
              patchUser(settings, logger, { bio }, userId),
              getUserToken(settings, logger, username, password),
            ];
            resolve(q.all(promises).then((result) => ({
              id: parseInt(result[0].id, 10),
              token: result[1],
            })));
          }
        });
    });
  });
}

module.exports = createUser;

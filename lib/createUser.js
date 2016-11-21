const request = require('superagent');
const q = require('q');

const getAuthorization = require('./util/getAuthorization');
const addContainer = require('./util/addContainer');
const patchUser = require('../').patchUser;
const getUserToken = require('../').getUserToken;

/**
 * Get the bio that will be inserted on the profile on flarum
 *
 * @param {object} resident The Sequelzie resident object
 * @returns {string} The bio
 */
function getBio(resident) {
  const bio = [];
  bio.push(`Naam: ${resident.get('fullName')}`);
  if (resident.house) {
    bio.push(`Huis: ${resident.house.get('constructionId')}`);
  }
  return bio.join('\n');
}

/**
 * Create a user on the flarum forums
 *
 * @param {object} settings The flarum settings
 * @param {object} logger Logger object, from restify
 * @param {string} username The username of the user
 * @param {string} password The password of the user
 * @param {string} email The email of the user
 * @param {object} resident The sequelize resident instance
 * @returns {Promise} Promise that resolves when done with the object:
 *                    {id: newUserId, token: loginToken}
 */
function createUser(settings, logger, username, password, email, resident) {
  return new q.Promise((resolve, reject) => {
    getAuthorization(logger).then((auth) => {
      logger.debug('Got authorization');
      let data = {
        username,
        password,
        email,
        isActivated: true,
      };

      // write bio
      logger.debug('Creating bio');
      const bio = getBio(resident);
      logger.debug('Bio:', bio);

      data = addContainer(data);

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
              patchUser({ bio }, userId),
              getUserToken(username, password),
            ];
            q.all(promises).then((result) => {
              resolve({ id: parseInt(result[0].id, 10), token: result[1] });
            });
          }
        });
    });
  });
}

module.exports = createUser;

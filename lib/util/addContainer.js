/**
 * Add the flarum api container to some data
 *
 * @param {object} data The data to encapsulate
 * @returns {object} The data in the correct container
 */
function addContainer(data) {
  return ({
    data: {
      attributes: data,
    },
  });
}

module.exports = addContainer;

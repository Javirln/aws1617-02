/* istanbul ignore next */
// This file is an example, it's not functionally used by the module.This

var host = 'http://' + process.env.IP + ':' + process.env.PORT;

module.exports = {
  info: { // API informations (required)
    title: 'Researcher API', // Title (required)
    version: '1.0.0', // Version (required)
    description: 'Researchers\' API endpoint', // Description (optional)
  },
  host: host, // Host (optional)
  basePath: '/api/v1', // Base path (optional)
};

const fs = require('fs');
const path = require('path');

module.exports = {
  mount: async (router) => {
    const apiRoutesPath = path.resolve(__dirname, 'api');
    const files = await fs.promises.readdir(apiRoutesPath);

    files.forEach((fileName) => {
      const route = require(path.resolve(apiRoutesPath, fileName));

      route(router);
    });
  }
};

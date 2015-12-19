module.exports = [
  'url'//,
  //'schedule'
].reduce((res, service) => {
  let implementation = require(`./${service}`);

  Object.keys(implementation)
    .forEach(route => res[`${service}_${route}`] = implementation[route]);

  return res;
}, {});

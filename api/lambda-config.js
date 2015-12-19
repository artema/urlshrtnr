let pkg = require('./package.json');

module.exports = {
  FunctionName: pkg.name,
  Description: `${pkg.description} (${pkg.version})`,
  Handler: 'index.handler',
  Role: 'arn:aws:iam::523266658163:role/shrtnr-lambda',
  Timeout: 10,
  MemorySize: 128
}

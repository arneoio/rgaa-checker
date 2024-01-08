module.exports = {
  extension: ['ts'],
  spec: './test/**/*.spec.ts',
  reporter: 'spec',
  require: ['ts-node/register', 'jsdom-global/register'],
};

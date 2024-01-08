var assert = require('assert');
var { JSDOM } = require('jsdom');
const Criterion2_1 = require('../styleguide/assets/scripts/extension/criteria/Criterion2_1.ts').default;

describe('Criterion2_1', function() {
  before(function() {
    // Créez un environnement DOM simulé avec jsdom
    const dom = new JSDOM(`
      <html><body>
      </body></html>
    `);
    global.document = dom.window.document;
    global.window = dom.window;
  });

  after(function() {
    // Nettoyez l'environnement DOM simulé après les tests
    delete global.document;
    delete global.window;
  });

  describe('runTest', function() {
    it('should return "NA" when no frames are found', function() {
      const criterion = new Criterion2_1(null, null, true);
      const result = criterion.runTest();
      assert.strictEqual(result, 'NA');
    });

    it('should return "C" when frames are found with titles', function() {
      const dom = new JSDOM(`
        <html><body><iframe title="Frame Title"></iframe></body></html>
      `);
      global.document = dom.window.document;

      const criterion = new Criterion2_1(null, null, true);
      const result = criterion.runTest();
      assert.strictEqual(result, 'C');
    });

    it('should return "NC" when frames are found without titles', function() {
      const dom = new JSDOM(`
        <html><body><iframe></iframe></body></html>
      `);
      global.document = dom.window.document;

      const criterion = new Criterion2_1(null, null, true);
      const result = criterion.runTest();
      assert.strictEqual(result, 'NC');
    });
  });
});

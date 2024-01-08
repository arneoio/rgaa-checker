var assert = require('assert');
var { JSDOM } = require('jsdom');
const Criterion2_2 = require('../styleguide/assets/scripts/extension/criteria/Criterion2_2.ts').default;

describe('Criterion2_2', function() {
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
      const criterion = new Criterion2_2(null, null, true);
      const result = criterion.runTest();
      assert.strictEqual(result, 'NA');
    });

    it('should return "NT" when frames with titles are found', function() {

      const dom = new JSDOM(`
        <html><body><iframe title="Frame Title"></iframe></body></html>
      `);
      global.document = dom.window.document;

      const criterion = new Criterion2_2(null, null, true);
      const result = criterion.runTest();
      assert.strictEqual(result, 'NT');
    });

    it('should return "NA" when frames without titles are found', function() {

      const dom = new JSDOM(`
        <html><body><iframe></iframe></body></html>
      `);
      global.document = dom.window.document;

      const criterion = new Criterion2_2(null, null, true);
      const result = criterion.runTest();
      assert.strictEqual(result, 'NA');
    });

    it('should return "NT" when a mix of frames with and without titles are found', function() {

      const dom = new JSDOM(`
        <html><body>
          <iframe title="Frame Title"></iframe>
          <iframe></iframe>
        </body></html>
      `);
      global.document = dom.window.document;

      const criterion = new Criterion2_2(null, null, true);
      const result = criterion.runTest();
      assert.strictEqual(result, 'NT');
    });
  });
});

var assert = require('assert');
var { JSDOM } = require('jsdom');
const Criterion6_2 = require('../styleguide/assets/scripts/extension/criteria/Criterion6_2.ts').default;

describe('Criterion6_2', function() {
  before(function() {
    // Créez un environnement DOM simulé avec jsdom
    const dom = new JSDOM(`
      <html><body></body></html>
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
    it('should return "C" when all links have labels', function() {
      const dom = new JSDOM(`
        <html><body>
          <a href="#">Link with label</a>
          <a href="#" aria-label="Aria labeled link"></a>
          <a href="#" aria-labelledby="label1"></a>
          <p id="label1">Label 1</p>
          <a href="#" title="Link title attribute"></a>
        </body></html>
      `);
      global.document = dom.window.document;

      const criterion = new Criterion6_2(null, null, true);
      const result = criterion.runTest();
      assert.strictEqual(result, 'C');
    });

    it('should return "NC" when at least one link have no labels', function() {
      const dom = new JSDOM(`
        <html><body>
          <a href="#">Link with label</a>
          <a href="#" aria-label="Aria labeled link"></a>
          <a href="#" aria-labelledby="label1"></a>
          <p id="label1">Label 1</p>
          <a href="#" title="Link title attribute"></a>
          <a href="#"></a>
        </body></html>
      `);
      global.document = dom.window.document;

      const criterion = new Criterion6_2(null, null, true);
      const result = criterion.runTest();
      assert.strictEqual(result, 'NC');
    });

    it('should return "NA" when no links are found', function() {
      // Modifiez l'environnement DOM simulé pour ce test
      const dom = new JSDOM(`
        <html><body></body></html>
      `);
      global.document = dom.window.document;

      const criterion = new Criterion6_2(null, null, true);
      const result = criterion.runTest();
      assert.strictEqual(result, 'NA');
    });
  });
});

var assert = require('assert');
var { JSDOM } = require('jsdom');
const Criterion4_1 = require('../styleguide/assets/scripts/extension/criteria/Criterion4_1.ts').default;

describe('Criterion4_1', function() {
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
    it('should return "NA" when no temporal media is present', function() {
      const criterion = new Criterion4_1(null, null, true);
      const result = criterion.runTest();
      assert.strictEqual(result, 'NA');
    });

    it('should return "NT" when at least one <audio> element is present', function() {
      const dom = new JSDOM(`
        <html><body>
          <audio></audio>
        </body></html>
      `);
      global.document = dom.window.document;

      const criterion = new Criterion4_1(null, null, true);
      const result = criterion.runTest();
      assert.strictEqual(result, 'NT');
    });

    it('should return "NT" when at least one <video> element is present', function() {
      const dom = new JSDOM(`
        <html><body>
          <video></video>
        </body></html>
      `);
      global.document = dom.window.document;

      const criterion = new Criterion4_1(null, null, true);
      const result = criterion.runTest();
      assert.strictEqual(result, 'NT');
    });

    it(`should return "NA" when <object> tag doesn't contain an embed tag element is present`, function() {
      const dom = new JSDOM(`
        <html><body>
          <object></object>
        </body></html>
      `);
      global.document = dom.window.document;

      const criterion = new Criterion4_1(null, null, true);
      const result = criterion.runTest();
      assert.strictEqual(result, 'NA');
    });

    it('should return "NT" when <object> element contains an <embed> element', function() {
      const dom = new JSDOM(`
        <html><body>
          <object>
            <embed></embed>
          </object>
        </body></html>
      `);
      global.document = dom.window.document;

      const criterion = new Criterion4_1(null, null, true);
      const result = criterion.runTest();
      assert.strictEqual(result, 'NT');
    });

    it('should return "NA" if a <svg> element is present without <animate>, <animateTransform> or <animateMotion> tag', function() {
      const dom = new JSDOM(`
        <html><body>
          <svg></svg>
        </body></html>
      `);
      global.document = dom.window.document;

      const criterion = new Criterion4_1(null, null, true);
      const result = criterion.runTest();
      assert.strictEqual(result, 'NA');
    });

    it('should return "NA" when SVG element has aria-hidden set to true', function() {
      const dom = new JSDOM(`
        <html><body>
          <svg aria-hidden="true">
            <animate></animate>
          </svg>
        </body></html>
      `);
      global.document = dom.window.document;

      const criterion = new Criterion4_1(null, null, true);
      const result = criterion.runTest();
      assert.strictEqual(result, 'NA');
    });

    it('should return "NT" if a <svg> element is present with <animate> tag', function() {
      const dom = new JSDOM(`
        <html><body>
          <svg>
            <animate></animate>
          </svg>
        </body></html>
      `);
      global.document = dom.window.document;

      const criterion = new Criterion4_1(null, null, true);
      const result = criterion.runTest();
      assert.strictEqual(result, 'NT');
    });

    it('should return "NT" if a <svg> element is present with <animateTransform> tag', function() {
      const dom = new JSDOM(`
        <html><body>
          <svg>
            <animateTransform></animateTransform>
          </svg>
        </body></html>
      `);
      global.document = dom.window.document;

      const criterion = new Criterion4_1(null, null, true);
      const result = criterion.runTest();
      assert.strictEqual(result, 'NT');
    });

    it('should return "NT" if a <svg> element is present with <animateMotion> tag', function() {
      const dom = new JSDOM(`
        <html><body>
          <svg>
            <animateMotion></animateMotion>
          </svg>
        </body></html>
      `);
      global.document = dom.window.document;

      const criterion = new Criterion4_1(null, null, true);
      const result = criterion.runTest();
      assert.strictEqual(result, 'NT');
    });

    it('should return "NA" when at least one <canvas> element is present but not animation', function() {
      const dom = new JSDOM(`
        <html><body>
          <canvas></canvas>
        </body></html>
      `);
      global.document = dom.window.document;

      const criterion = new Criterion4_1(null, null, true);
      const result = criterion.runTest();
      assert.strictEqual(result, 'NA');
    });

    it(`should return "NT" when <canvas> element has animationFrame in its 2D context`, function() {
      // Créez un environnement DOM simulé avec jsdom
      const dom = new JSDOM(`
        <html><body>
          <canvas></canvas>
        </body></html>
      `);
      global.document = dom.window.document;

      // Modifiez le contexte 2D pour inclure une méthode animate
      const canvas = document.querySelector('canvas');
      const context = canvas.getContext('2d') as any;

      context.animationFrame = () => {};

      const criterion = new Criterion4_1(null, null, true);
      const result = criterion.runTest();
      assert.strictEqual(result, 'NT');
    });

    it(`should return "NT" when <canvas> element has requestAnimationFrame in its 2D context`, function() {
      // Créez un environnement DOM simulé avec jsdom
      const dom = new JSDOM(`
        <html><body>
          <canvas></canvas>
        </body></html>
      `);
      global.document = dom.window.document;

      // Modifiez le contexte 2D pour inclure une méthode animate
      const canvas = document.querySelector('canvas');
      const context = canvas.getContext('2d') as any;

      context.requestAnimationFrame = () => {};

      const criterion = new Criterion4_1(null, null, true);
      const result = criterion.runTest();
      assert.strictEqual(result, 'NT');
    });

    it('should return "NT" when at least one <bgsound> element is present', function() {

      const dom = new JSDOM(`
        <html><body>
          <bgsound></bgsound>
        </body></html>
      `);
      global.document = dom.window.document;

      const criterion = new Criterion4_1(null, null, true);
      const result = criterion.runTest();
      assert.strictEqual(result, 'NT');
    });

    it('should return "NT" if multiple temporal medias are present', function() {

      const dom = new JSDOM(`
        <html><body>
          <audio></audio>
          <audio></audio>
          <video></video>
          <bgsound></bgsound>
        </body></html>
      `);
      global.document = dom.window.document;

      const criterion = new Criterion4_1(null, null, true);
      const result = criterion.runTest();
      assert.strictEqual(result, 'NT');
    });
  });
});

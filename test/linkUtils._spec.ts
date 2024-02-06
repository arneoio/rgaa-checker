var assert = require('assert');
var { JSDOM } = require('jsdom');
const LinkUtils = require('../styleguide/assets/scripts/extension/utils/LinkUtils.ts').default;

describe('LinkUtils', function() {
  before(function() {
    const dom = new JSDOM(`
      <html><body></body></html>
    `);
    global.document = dom.window.document;
  });

  after(function() {
    delete global.document;
  });

  describe('LinkUtils', function() {
    describe('extractCompositeLinkLabel', function() {
      it('should return an empty string for an element with no text content or image', function() {
        const dom = new JSDOM(`
          <html><body>
            <div></div>
          </body></html>
        `);
        global.document = dom.window.document;
        const $element = dom.window.document.querySelector('div');
        const result = LinkUtils.extractCompositeLinkLabel($element);
        assert.strictEqual(result, '');
      });

      it('should return the text content of a text node', function() {
        const dom = new JSDOM(`
          <html><body>
            <p>Text content</div>
          </body></html>
        `);
        global.document = dom.window.document;
        const $element = dom.window.document.querySelector('p');

        const result = LinkUtils.extractCompositeLinkLabel($element);
        assert.strictEqual(result, 'Text content');
      });

      it('should return the alt text of an image element', function() {
        const dom = new JSDOM(`
          <html><body>
            <img src="image.jpg" alt="Image Alt Text" />
          </body></html>
        `);
        global.document = dom.window.document;
        const $image = dom.window.document.querySelector('img');

        const result = LinkUtils.extractCompositeLinkLabel($image);
        assert.strictEqual(result, 'Image Alt Text');
      });

      it('should return the concatenated text and alt text of an element with both', function() {
        const dom = new JSDOM(`
          <html><body>
            <div>Text Content</div>
            <img src="image.jpg" alt="Image Alt Text" />
          </body></html>
        `);
        global.document = dom.window.document;
        const $element = dom.window.document.querySelector('div');

        const result = LinkUtils.extractCompositeLinkLabel($element);
        assert.strictEqual(result, 'Text Content Image Alt Text');
      });

      it('should recursively process child elements', function() {
        const dom = new JSDOM(`
          <html><body>
            <div>
              <p>Paragraph Text</p>
              <img src="image.jpg" alt="Image Alt Text" />
            </div>
          </body></html>
        `);
        global.document = dom.window.document;
        const $element = dom.window.document.querySelector('div');

        const result = LinkUtils.extractCompositeLinkLabel($element);
        assert.strictEqual(result, 'Paragraph Text Image Alt Text');
      });

      it('should ignore comment nodes', function() {
        const dom = new JSDOM(`
          <html><body>
            <div>
              <!-- Comment -->
              <img src="image.jpg" alt="Image Alt Text" />
            </div>
          </body></html>
        `);
        global.document = dom.window.document;
        const $element = dom.window.document.querySelector('div');

        const result = LinkUtils.extractCompositeLinkLabel($element);
        assert.strictEqual(result, 'Image Alt Text');
      });

      // Ajoutez d'autres tests similaires ici pour couvrir d'autres cas de figure...

    });
  });
});

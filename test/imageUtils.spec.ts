var assert = require('assert');
var { JSDOM } = require('jsdom');
const ImageUtils = require('../styleguide/assets/scripts/extension/utils/ImageUtils.ts').default;

describe('ImageUtils', function() {
  before(function() {
    const dom = new JSDOM(`
      <html><body></body></html>
    `);
    global.document = dom.window.document;
  });

  after(function() {
    delete global.document;
  });

  describe('isImageElement', function() {
    it('should return true for <img> element', function() {
      const $image = document.createElement('img');
      const result = ImageUtils.isImageElement($image);
      assert.strictEqual(result, true);
    });

    it('should return true for <svg> element', function() {
      const $image = document.createElement('svg');
      const result = ImageUtils.isImageElement($image);
      assert.strictEqual(result, true);
    });

    it('should return true for <canvas> element', function() {
      const $image = document.createElement('canvas');
      const result = ImageUtils.isImageElement($image);
      assert.strictEqual(result, true);
    });

    it('should return true for <area> element with href', function() {
      const $image = document.createElement('area');
      $image.setAttribute('href', 'example.com');
      const result = ImageUtils.isImageElement($image);
      assert.strictEqual(result, true);
    });

    it('should return false for <area> element without href', function() {
      const $image = document.createElement('area');
      const result = ImageUtils.isImageElement($image);
      assert.strictEqual(result, false);
    });

    it('should return true for <input type="image"> element', function() {
      const $image = document.createElement('input');
      $image.setAttribute('type', 'image');
      const result = ImageUtils.isImageElement($image);
      assert.strictEqual(result, true);
    });

    it('should return true for other <input> element', function() {
      const $image = document.createElement('input');
      const result = ImageUtils.isImageElement($image);
      assert.strictEqual(result, false);
    });

    it('should return true for <object type="image/..."> element', function() {
      const $image = document.createElement('object');
      $image.setAttribute('type', 'image/png');
      const result = ImageUtils.isImageElement($image);
      assert.strictEqual(result, true);
    });

    it('should return false for <object> element without type', function() {
      const $image = document.createElement('object');
      const result = ImageUtils.isImageElement($image);
      assert.strictEqual(result, false);
    });

    it('should return true for <embed type="image/..."> element', function() {
      const $image = document.createElement('embed');
      $image.setAttribute('type', 'image/jpeg');
      const result = ImageUtils.isImageElement($image);
      assert.strictEqual(result, true);
    });

    it('should return false for <embed> element without type', function() {
      const $image = document.createElement('embed');
      const result = ImageUtils.isImageElement($image);
      assert.strictEqual(result, false);
    });

    it('should return false for other elements', function() {
      const $image = document.createElement('div');
      const result = ImageUtils.isImageElement($image);
      assert.strictEqual(result, false);
    });
  });

  describe('hasImageLabel', function() {
    it('should return false for elements other than supported ones', function() {
      const $element = document.createElement('div');
      const result = ImageUtils.hasImageLabel($element);
      assert.strictEqual(result, false);
    });

    it('should return true if aria-labelledby is defined and valid', function() {
      const $image = document.createElement('img');
      $image.setAttribute('aria-labelledby', 'labelId');
      const $label = document.createElement('div');
      $label.id = 'labelId';
      document.body.appendChild($label);
      const result = ImageUtils.hasImageLabel($image);
      assert.strictEqual(result, true);
    });

    it('should return false if aria-labelledby is defined for <area> element', function() {
      const $image = document.createElement('area');
      $image.setAttribute('aria-labelledby', 'labelAreaId');
      const $label = document.createElement('div');
      $label.id = 'labelAreaId';
      document.body.appendChild($label);
      const result = ImageUtils.hasImageLabel($image);
      assert.strictEqual(result, false);
    });

    it('should return false if aria-labelledby is defined but invalid', function() {
      const $image = document.createElement('img');
      $image.setAttribute('aria-labelledby', 'labelInvalidId');
      const result = ImageUtils.hasImageLabel($image);
      assert.strictEqual(result, false);
    });

    it('should return true if aria-label is defined', function() {
      const $image = document.createElement('img');
      $image.setAttribute('aria-label', 'Label');
      const result = ImageUtils.hasImageLabel($image);
      assert.strictEqual(result, true);
    });

    it('should return true if alt is defined for supported elements', function() {
      const supportedElements = ['img', 'area', 'input'];
      for (const tagName of supportedElements) {
        const $image = document.createElement(tagName);
        $image.setAttribute('alt', 'Alternative Text');
        // Adds required attributes for <area> and <input> elements
        if(tagName === 'area') {
          $image.setAttribute('href', 'example.com');
        } else if(tagName === 'input') {
          $image.setAttribute('type', 'image');
        }
        const result = ImageUtils.hasImageLabel($image);
        assert.strictEqual(result, true);
      }
    });

    it('should return true if title is defined for supported elements', function() {
      const supportedElements = ['img', 'input', 'object', 'embed'];
      for (const tagName of supportedElements) {
        const $image = document.createElement(tagName);
        $image.setAttribute('title', 'Title');
        // Adds required attributes for <input>, <object> and <embed> elements
        if(tagName === 'input') {
          $image.setAttribute('type', 'image');
        } else if(tagName === 'object') {
          $image.setAttribute('type', 'image/png');
        } else if(tagName === 'embed') {
          $image.setAttribute('type', 'image/jpeg');
        }
        const result = ImageUtils.hasImageLabel($image);
        assert.strictEqual(result, true);
      }
    });

    it('should return false if none of the label attributes are defined', function() {
      const $image = document.createElement('img');
      const result = ImageUtils.hasImageLabel($image);
      assert.strictEqual(result, false);
    });
  });

  describe('getImageLabel', function() {
    it('should return an empty string for elements other than supported ones', function() {
      const $element = global.document.createElement('div');
      const result = ImageUtils.getImageLabel($element);
      assert.strictEqual(result, '');
    });

    it('should return the label specified by aria-labelledby', function() {
      const dom = new JSDOM(`
        <html><body>
          <img aria-labelledby="labelId" />
          <div id="labelId">Aria labelled by text</div>
        </body></html>
      `);
      global.document = dom.window.document;
      const $image = dom.window.document.querySelector('img');

      const result = ImageUtils.getImageLabel($image);
      assert.strictEqual(result, 'Aria labelled by text');
    });

    it('should return the value of aria-label', function() {
      const dom = new JSDOM(`
        <html><body>
          <img aria-label="Aria label text" />
        </body></html>
      `);
      global.document = dom.window.document;
      const $image = dom.window.document.querySelector('img');

      const result = ImageUtils.getImageLabel($image);
      assert.strictEqual(result, 'Aria label text');
    });

    it('should return the value of alt for supported elements', function() {
      const supportedElements = ['img', 'area', 'input'];
      for (const tagName of supportedElements) {
        let attribute = '';
        if(tagName === 'area') {
          attribute = 'href="example.com"';
        } else if(tagName === 'input') {
          attribute = 'type="image"';
        }
        const dom = new JSDOM(`
          <html><body>
            <${tagName} alt="Alternative Text" ${attribute} />
          </body></html>
        `);
        global.document = dom.window.document;
        const $image = dom.window.document.querySelector(tagName);

        const result = ImageUtils.getImageLabel($image);
        assert.strictEqual(result, 'Alternative Text');
      }
    });

    it('should return the value of title for supported elements', function() {
      const supportedElements = ['img', 'input', 'object', 'embed'];
      for (const tagName of supportedElements) {
        let attribute = '';
        if(tagName === 'input') {
          attribute = 'type="image"';
        } else if(tagName === 'object') {
          attribute = 'type="image/png"';
        } else if(tagName === 'embed') {
          attribute = 'type="image/jpeg"';
        }
        const dom = new JSDOM(`
          <html><body>
            <${tagName} title="Title" ${attribute} />
          </body></html>
        `);
        global.document = dom.window.document;
        const $image = dom.window.document.querySelector(tagName);

        const result = ImageUtils.getImageLabel($image);
        assert.strictEqual(result, 'Title');
      }
    });

    it('should return an empty string if none of the label attributes are defined', function() {
      const dom = new JSDOM(`
        <html><body>
          <img />
        </body></html>
      `);
      global.document = dom.window.document;
      const $image = dom.window.document.querySelector('img');

      const result = ImageUtils.getImageLabel($image);
      assert.strictEqual(result, '');
    });

    it('should return the aria-labelledby label if aria-label is also defined', function() {
      const dom = new JSDOM(`
        <html><body>
          <img aria-labelledby="labelId" aria-label="Aria label text" />
          <div id="labelId">Aria labelled by text</div>
        </body></html>
      `);
      global.document = dom.window.document;
      const $image = dom.window.document.querySelector('img');

      const result = ImageUtils.getImageLabel($image);
      assert.strictEqual(result, 'Aria labelled by text');
    });

    it('should return the aria-labelledby label if alt is also defined', function() {
      const dom = new JSDOM(`
        <html><body>
          <img aria-labelledby="labelId" alt="Alternative Text" />
          <div id="labelId">Aria labelled by text</div>
        </body></html>
      `);
      global.document = dom.window.document;
      const $image = dom.window.document.querySelector('img');

      const result = ImageUtils.getImageLabel($image);
      assert.strictEqual(result, 'Aria labelled by text');
    });

    it('should return the aria-labelledby label if title is also defined', function() {
      const dom = new JSDOM(`
        <html><body>
          <img aria-labelledby="labelId" title="Title" />
          <div id="labelId">Aria labelled by text</div>
        </body></html>
      `);
      global.document = dom.window.document;
      const $image = dom.window.document.querySelector('img');

      const result = ImageUtils.getImageLabel($image);
      assert.strictEqual(result, 'Aria labelled by text');
    });

    it('should return the aria-label if alt is also defined', function() {
      const dom = new JSDOM(`
        <html><body>
          <img aria-label="Aria label text" alt="Alternative Text" />
        </body></html>
      `);
      global.document = dom.window.document;
      const $image = dom.window.document.querySelector('img');

      const result = ImageUtils.getImageLabel($image);
      assert.strictEqual(result, 'Aria label text');
    });

    it('should return the aria-label if title is also defined', function() {
      const dom = new JSDOM(`
        <html><body>
          <img aria-label="Aria label text" title="Title" />
        </body></html>
      `);
      global.document = dom.window.document;
      const $image = dom.window.document.querySelector('img');

      const result = ImageUtils.getImageLabel($image);
      assert.strictEqual(result, 'Aria label text');
    });

    it('should return the alt if title is also defined', function() {
      const dom = new JSDOM(`
        <html><body>
          <img alt="Alternative Text" title="Title" />
        </body></html>
      `);
      global.document = dom.window.document;
      const $image = dom.window.document.querySelector('img');

      const result = ImageUtils.getImageLabel($image);
      assert.strictEqual(result, 'Alternative Text');
    });
  });
});

const fs = require('fs');
require('dotenv').config();

const DesignSystem = {
  generate: function () {
    this.sourcesAssetFolder = process.env.STYLEGUIDE_ASSETS_PATH;
    this.componentsSourceFolder = `${process.env.STYLEGUIDE_PATH}/components`;
    this.designSystemDestinationFolder = `${this.componentsSourceFolder}/05-design-system/`;
    this.sourcesBuildFolder = process.env.FRACTAL_STATIC_FOLDER;

    this.iconFolder = `${this.sourcesAssetFolder}/icons`;
    this.sassVarFile = `${this.componentsSourceFolder}/00-base/_var.scss`;
    this.sassFontFile = `${this.componentsSourceFolder}/00-base/_fonts.scss`;

    this.template = this.generateTemplates();

    fs.writeFileSync(
      this.designSystemDestinationFolder + 'design-system.html.twig',
      this.template,
    );
    console.log('Design system generated!');
  },

  generateTemplates: function () {
    let designSystemStyle = fs.readFileSync(
      this.designSystemDestinationFolder + 'design-system.css',
      'utf-8',
    );
    let designSystemScript = fs.readFileSync(
      this.designSystemDestinationFolder + 'design-system.js',
      'utf-8',
    );
    var templateContent = `<style>${designSystemStyle}</style><div class="documentContent">`;
    templateContent += this.setIconList();
    templateContent += this.setColorList();
    templateContent += this.setFontList();
    templateContent += `</div><script>${designSystemScript}</script>`;

    return templateContent;
  },

  readLines: function (inputFile) {
    if (!fs.existsSync(inputFile)) {
      return [];
    }
    const fileContent = fs.readFileSync(inputFile, 'utf-8');
    return fileContent.split(/\r?\n/);
  },

  // Generates icon list from icon folder
  setIconList: function () {
    var iconListHtml = `<h2 class="documentTitle">Icons</h2><div class="rangeInput"><p class="rangeInput_wrapper"><input type="range" min="6" max="120" value="50" id="styleguide-icon-size-slider" /></p>
        <p class="rangeInput_value" id="styleguide-icon-size-value">50px</p></div>
        <ul class="icons">`;
    var iconFileList = fs.readdirSync(this.iconFolder);
    iconFileList.forEach((file) => {
      var iconName = file.replace('.svg', '');
      iconListHtml += `<li class="icons_icon"><div class="icons_image">
        <svg aria-hidden="true" class="a-icon">
          <use xlink:href="/${this.sourcesBuildFolder}/icons.svg#i-${iconName}"/>
        </svg>
        </div>${iconName}</li>`;
    });
    iconListHtml += '</ul>';
    return iconListHtml;
  },

  // Generates color list template from _var.scss file
  setColorList: function () {
    var colorListHtml = '<h2 class="documentTitle">Colors</h2>';
    var isInColorList = false;
    var lineList = this.readLines(this.sassVarFile);

    let colorMatch = [];
    let colorMatchDS = [];
    let newColorMatchDS = [];

    lineList.forEach((line) => {
      var colorRegex = /\$([-a-z]+)\s*:\s*(#[0-9a-fA-F]{3}|#[0-9a-fA-F]{6});/;
      var colorRegexDS = /\$([-a-z\d]+)\s*:\s*\$([-a-z]+);/;
      var color = line.match(colorRegex);
      var colorDS = line.match(colorRegexDS);

      if (color) {
        colorMatch = [...colorMatch, { name: color[1], color: color[2] }];
      }

      if (colorDS) {
        colorMatchDS = [
          ...colorMatchDS,
          { name: colorDS[1], value: colorDS[2] },
        ];
      }

      if (color) {
        if (!isInColorList) {
          isInColorList = true;
          colorListHtml += `<ul class="colorsList">`;
        }
        colorListHtml += `<li class="colorsList_item"><span style="background-color: ${color[2]};" class="colorsList_itemColor"></span><span class="colorsList_itemName">${color[1]}<br />(${color[2]})</span></li>`;
      } else {
        if (isInColorList) {
          isInColorList = false;
          colorListHtml += `</ul>`;
        }
      }
    });

    colorMatch.forEach((item) => {
      const keysFilter = item.name;
      colorMatchDS.forEach((itemFilter) => {
        if (itemFilter.value === keysFilter) {
          itemFilter.color = item.color;
          newColorMatchDS = [...newColorMatchDS, itemFilter];
        }
      });
    });

    colorListHtml += `<ul class="colorsList">`;
    newColorMatchDS.forEach((item) => {
      colorListHtml += `<li class="colorsList_item"><span style="background-color: ${item.color};" class="colorsList_itemColor"></span><span class="colorsList_itemName">${item.name}<br />(${item.value})</span></li>`;
    });
    colorListHtml += `</ul>`;

    return colorListHtml;
  },

  // Generates font list from _fonts.scss file
  setFontList: function () {
    var isInFont = false;
    var fontList = [];
    var font = {};
    var lineList = this.readLines(this.sassFontFile);
    lineList.forEach((line) => {
      var fontFaceStartRegex = /@font-face {/;
      var fontFaceEndRegex = /}/;
      if (line.match(fontFaceStartRegex)) {
        isInFont = true;
        font = {};
        return;
      } else if (line.match(fontFaceEndRegex)) {
        isInFont = false;
        fontList.push(font);
        return;
      }

      if (isInFont) {
        var fontDataRegex = /font-([a-z]+)\s*:\s*(.*);/;
        var fontData = line.match(fontDataRegex);
        if (fontData) {
          font[fontData[1]] = fontData[2];
        }
      }
    });

    var fontHtml = `<h2 class="documentTitle">Fonts</h2><div class="rangeInput"><p class="rangeInput_wrapper"><input type="range" min="6" max="72" value="18" id="styleguide-font-size-slider" /></p>
        <p class="rangeInput_value" id="styleguide-font-size-value">18px</p></div>`;
    fontList.forEach((font) => {
      var style = '';
      var name = '';
      for (var property in font) {
        if (Object.prototype.hasOwnProperty.call(font, property)) {
          if (property === 'family') {
            name = font[property] + ' ' + name;
          } else {
            name += ' ' + font[property];
          }
          style += `font-${property}: ${font[property]};`;
        }
      }
      fontHtml += `<p class="fontsListItem" style="${style}">${name} - Voix ambiguë d'un coeur qui au zéphyr préfère les jattes de kiwis 0123456789</p>`;
    });
    return fontHtml;
  },
};

DesignSystem.generate();

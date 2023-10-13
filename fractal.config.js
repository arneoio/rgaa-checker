require('dotenv').config();
var packageJson = require('./package.json');

const path = require('path');
const fs = require('fs');
const STYLEGUIDE_PATH = path.resolve(__dirname, process.env.STYLEGUIDE_PATH);
const STATIC_FOLDER = path.resolve(
  __dirname,
  process.env.FRACTAL_STATIC_FOLDER,
);
const STATIC_MOUNT = `/${process.env.FRACTAL_STATIC_FOLDER}`;
const BUILDER_FOLDER = path.resolve(
  __dirname,
  process.env.FRACTAL_BUILDER_FOLDER,
);

const namespaces = {
  atom: './10-atoms',
  molecule: './15-molecules',
  organism: './20-organisms',
  templates: './25-templates',
};

/* Create a new Fractal instance and export it for use elsewhere if required */
const fractal = (module.exports = require('@frctl/fractal').create());

/* Set project info from package.json data */
fractal.set(
  'project.title',
  `${packageJson.name.charAt(0).toUpperCase()}${packageJson.name
    .slice(1)
    .replace(/-/g, ' ')}`,
);
fractal.set('project.version', `v${packageJson.version}`);
fractal.set('project.repository', packageJson.repository.url);
fractal.set('project.author', packageJson.author);

/* Tell Fractal where the components will live */
fractal.components.set('path', path.resolve(`${STYLEGUIDE_PATH}/components`));

/* Tell Fractal where the documentation pages will live */
fractal.docs.set('path', path.resolve(`${STYLEGUIDE_PATH}/docs`));

// Tell the Fractal web preview plugin where to look for static assets.
fractal.web.set('static.path', STATIC_FOLDER);
fractal.web.set('static.mount', STATIC_MOUNT);

// Tell Fractal where to build
fractal.web.set('server.sync', true);
fractal.web.set('server.syncOptions', {
  watchOptions: {
    ignoreInitial: true,
    ignored: path.resolve(__dirname, BUILDER_FOLDER),
  },
});
fractal.web.set('builder.dest', path.resolve(__dirname, BUILDER_FOLDER));

// Use twig adapter
const twigAdapter = require('@frctl/twig')({
  importContext: false,
  handlePrefix: '@',
  base: '/',
  namespaces: namespaces,
  functions: {
    asset: function (path) {
      return path;
    },

    path: function (str) {
      return str;
    },

    url: function (str) {
      return '/';
    },
  },
  filters: {
    trans: function (str) {
      return str;
    },
    slug: function (str) {
      return str;
    },
    markdown_to_html: function (str) {
      return str;
    },
  },
});

fractal.components.engine(twigAdapter);
fractal.components.set('ext', '.html.twig');

/* Fractal theme */
const webUITheme = require('@frctl/mandelbrot')({
  styles: ['default', `${STATIC_MOUNT}/overrides.css`],
  skin: {
    accent: '#fe5e55',
    complement: '#f5f5f5',
    links: '#252525',
  },
});

/*
 * Specify a directory to hold the theme override templates
 * See https://github.com/frctl/mandelbrot/tree/master/views for examples of default templates
 */
webUITheme.addLoadPath(STATIC_FOLDER + '/webui');
fractal.web.theme(webUITheme);

/* Fractal Parse components
–––––––––––––––––––––––––––––––––––––––––––––––––– */
/*
 * Parse all components to know where they have called and what they use
 */
const ParseComponents = {
  generate: function () {
    this.componentsSourceFolder = `${process.env.STYLEGUIDE_PATH}/components`;

    this.usesPartialList = {};
    this.usedPartialList = {};

    this.twigFileList = this.getTwigFiles(this.componentsSourceFolder);
    this.parseTemplateFiles(this.twigFileList);

    fractal.set('project.usesPartialList', this.usesPartialList);
    fractal.set('project.usedPartialList', this.usedPartialList);
  },

  readLines: function (inputFile) {
    const fileContent = fs.readFileSync(inputFile, 'utf-8');
    return fileContent.split(/\r?\n/);
  },

  parseTemplateFiles: function (twigFileList) {
    twigFileList.forEach((twigFile) => {
      this.usedPartialList[twigFile] = [];
      const lineList = this.readLines(twigFile);
      lineList.forEach((line) => {
        const match = line.match(/{%\sinclude\s'@([-/a-z.]+).*/);
        if (match) {
          const pathComponent = match[1];

          const linkedPartialUrlUsed = this.formatUrlComponent(pathComponent);
          const linkedPartialUrlUses = this.formatUrlComponent(twigFile);

          let linkedPartialName = pathComponent;
          Object.keys(namespaces).forEach((namepace) => {
            linkedPartialName = linkedPartialName.replace(
              namepace,
              namespaces[namepace],
            );
          });
          linkedPartialName = path.join(
            this.componentsSourceFolder,
            linkedPartialName,
          );

          let boolUsed = true;
          let boolUses = true;

          this.usedPartialList[twigFile].find((ele) => {
            if (ele.name === linkedPartialName) {
              boolUsed = false;
            }
          });

          if (boolUsed) {
            this.usedPartialList[twigFile].push({
              name: linkedPartialName,
              url: linkedPartialUrlUsed,
            });
          }

          if (
            !Object.prototype.hasOwnProperty.call(
              this.usesPartialList,
              linkedPartialName,
            )
          ) {
            this.usesPartialList[linkedPartialName] = [];
          }

          this.usesPartialList[linkedPartialName].find((ele) => {
            if (ele.name === twigFile) {
              boolUses = false;
            }
          });

          if (boolUses) {
            this.usesPartialList[linkedPartialName].push({
              name: twigFile,
              url: linkedPartialUrlUses,
            });
          }
        }
      });
    });
  },

  formatUrlComponent: function (pathComp) {
    let result = pathComp.match(/[^/|\\]*$/)[0].replace(/.html.twig/, '');
    result = path.join('/components/detail/', result);
    return result;
  },

  getTwigFiles: function (base, files, result) {
    let ext = 'html.twig';
    files = files || fs.readdirSync(base);
    result = result || [];

    files.forEach((file) => {
      var newbase = path.join(base, file);
      if (fs.statSync(newbase).isDirectory()) {
        result = this.getTwigFiles(newbase, fs.readdirSync(newbase), result);
      } else {
        if (file.substr(-1 * (ext.length + 1)) == '.' + ext) {
          result.push(newbase);
        }
      }
    });
    return result;
  },
};

ParseComponents.generate();

require('dotenv').config();
const path = require('path');
const glob = require('glob');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const STYLEGUIDE_PATH = path.resolve(__dirname, process.env.STYLEGUIDE_PATH);
const ASSETS_PATH = path.resolve(__dirname, process.env.STYLEGUIDE_ASSETS_PATH);
const SVG_ICON_PATH = path.resolve(ASSETS_PATH, 'icons/');
let BUILD_FOLDER = path.resolve(__dirname, process.env.FRACTAL_STATIC_FOLDER);
const ENTRY_FILE = `${STYLEGUIDE_PATH}/components/app.ts`;
const DEVTOOLS_ENTRY_FILE = `${STYLEGUIDE_PATH}/components/devtools.ts`;

module.exports = (env, argv) => {
  const devMode = argv.mode !== 'production';
  let builtExtension = 'chrome';

  if (!devMode) {
    if(!argv.env || !argv.env.app || ['chrome', 'firefox'].indexOf(argv.env.app) < 0)
    {
      throw new Error('Please specify the extension type in the environment variable "app"');
    }
    builtExtension = argv.env.app;
    BUILD_FOLDER = `${BUILD_FOLDER}/${builtExtension}`;
  }

  const copyPatterns = [
    {
      from: path.resolve(`${ASSETS_PATH}/images`),
      to: path.resolve(`${BUILD_FOLDER}/images`),
    },
    {
      from: path.resolve(`${ASSETS_PATH}/manifest_${builtExtension}.json`),
      to: path.resolve(`${BUILD_FOLDER}/manifest.json`),
    },
    {
      from: path.resolve(`${ASSETS_PATH}/scripts/background_${builtExtension}.js`),
      to: path.resolve(`${BUILD_FOLDER}/scripts/background.js`),
    },
    {
      from: path.resolve(`${ASSETS_PATH}/scripts/extension`),
      to: path.resolve(`${BUILD_FOLDER}/scripts/extension`),
    },
  ];

  if (devMode) {
    copyPatterns.push({
      from: path.resolve(__dirname, `${ASSETS_PATH}/webui`),
      to: path.resolve(`${BUILD_FOLDER}/webui`),
      globOptions: {
        ignore: ['overrides.scss', 'overrides.css'],
      },
    });
  }

  return {
    entry: {
      app: ENTRY_FILE,
      devtools: DEVTOOLS_ENTRY_FILE,
      icons: glob.sync(
        path.resolve(path.join(SVG_ICON_PATH, '**/*.svg')).replace(/\\/g, '/'),
      ),
      ...(devMode && {
        overrides: path.resolve(`${ASSETS_PATH}/webui/overrides.scss`),
      }),
    },
    output: {
      path: BUILD_FOLDER,
    },
    optimization: {
      minimize: false, // don't minify js even in production
    },
    stats: {
      children: true,
      errorDetails: true,
    },
    mode: devMode,
    devtool: devMode ? 'source-map' : false,
    watch: !!devMode,
    performance: {
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
    },
    module: {
      rules: [
        // TypeScript
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          include: [STYLEGUIDE_PATH],
        },
        // Vanilla JS
        {
          enforce: 'pre',
          test: /\.js$/,
          exclude: /node_modules|vendor/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                cacheDirectory: true,
              },
            },
            {
              loader: 'eslint-loader',
              options: {
                quiet: true,
              },
            },
          ],
        },
        // SCSS
        {
          test: /\.(css|scss)$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader',
            'resolve-url-loader',
            {
              loader: 'sass-loader',
              options: {
                sourceMap: devMode ? true : false,
              },
            },
          ],
        },
        // Images
        {
          test: /\.(png|jpg|jpeg|gif|ico|svg|webp)$/,
          loader: 'file-loader',
          include: path.resolve(`${ASSETS_PATH}/images`),
          options: {
            outputPath: 'images/',
            name: (f) => {
              let dirNameInsideAssets = path.relative(
                'assets/images',
                path.dirname(f),
              );
              return `${dirNameInsideAssets}/[name].[ext]`;
            },
          },
        },
        // Fonts
        {
          test: /\.(woff2)$/,
          include: path.resolve(`${ASSETS_PATH}/fonts`),
          type: 'asset/resource',
        },
        // SPRITE SVG
        {
          test: /\.svg$/,
          include: SVG_ICON_PATH,
          use: [
            {
              loader: 'svg-sprite-loader',
              options: {
                extract: true,
                spriteFilename: 'icons.svg',
                esModule: false,
                symbolId: (filePath) => 'i-' + path.basename(filePath, '.svg'),
              },
            },
            {
              loader: 'svgo-loader',
              options: {
                plugins: [
                  { name: 'removeViewBox', active: false },
                  { name: 'removeDimensions' },
                  { name: 'removeNonInheritableGroupAttrs' },
                  { name: 'collapseGroups' },
                ],
              },
            },
          ],
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].css',
      }),
      new SpriteLoaderPlugin({
        plainSprite: true,
      }),
      new CopyWebpackPlugin({
        patterns: copyPatterns,
      }),
    ],
  };
};

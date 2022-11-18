/* eslint-disable @typescript-eslint/no-var-requires */
const CracoAlias = require("craco-alias");
const CracoESLintWebpackPlugin = require("craco-eslint-webpack-plugin");
const CracoLessPlugin = require("craco-less");
const { loaderByName } = require("@craco/craco");
const CracoEsbuildPlugin = require("craco-esbuild");
const { GenerateSW } = require("workbox-webpack-plugin");
const path = require("path");

const lessModuleRegex = /\.module\.less$/;

const isProd = process.env.NODE_ENV === "production";

module.exports = {
  plugins: [
    {
      plugin: CracoEsbuildPlugin,
      options: {
        includePaths: [path.join(__dirname, "src")], // Optional. If you want to include components which are not in src folder
        esbuildLoaderOptions: {
          // Optional. Defaults to auto-detect loader.
          loader: "tsx", // Set the value to 'tsx' if you use typescript
          target: "es2015",
        },
        esbuildMinimizerOptions: {
          // Optional. Defaults to:
          target: "es2015",
          css: true, // if true, OptimizeCssAssetsWebpackPlugin will also be replaced by esbuild.
        },
        skipEsbuildJest: false, // Optional. Set to true if you want to use babel for jest tests,
        esbuildJestOptions: {
          loaders: {
            ".ts": "ts",
            ".tsx": "tsx",
          },
        },
      },
    },
    {
      plugin: CracoAlias,
      options: {
        // source: 'tsconfig',
        // tsConfigPath: "./tsconfig.json",
        baseUrl: "./src",
        aliases: {
          "@apis": "./apis",
          "@images": "./images",
          "@components": "./components",
          "@constants": "./constants",
          "@interfaces": "./interfaces",
          "@hooks": "./hooks",
          "@common": "./common",
          "@pages": "./pages",
          "@utils": "./utils",
          "@layout": "./layout",
          "@src": "./",
        },
      },
    },
    {
      plugin: CracoESLintWebpackPlugin,
      options: {
        skipPreflightCheck: true,
        eslintOptions: {
          files: "src/**/*.{js,jsx,ts,tsx}",
          lintDirtyModulesOnly: true,
          emitWarning: true,
        },
      },
    },
    {
      plugin: CracoLessPlugin,
      options: {
        // less loader option
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              "@primary-color": "#2378ff",
            },
            javascriptEnabled: true,
          },
        },
        modifyLessRule(lessRule) {
          lessRule.exclude = lessModuleRegex;
          return lessRule;
        },
        modifyLessModuleRule(lessModuleRule) {
          // configure the file suffix
          lessModuleRule.test = lessModuleRegex;

          // configure the generated local ident name
          const cssLoader = lessModuleRule.use.find(loaderByName("css-loader"));
          cssLoader.options.modules = {
            localIdentName: "[local]_[hash:base64:5]",
          };

          return lessModuleRule;
        },
      },
    },
  ],
  // https://github.com/dilanx/craco/blob/master/packages/craco/README.md
  // reactScriptsVersion: "react-scripts" /* (default value) */,
  // style: {
  //   modules: {
  //     localIdentName: ""
  //   },
  //   css: {
  //     loaderOptions: {
  //       /* Any css-loader configuration options: https://github.com/webpack-contrib/css-loader. */
  //     },
  //     loaderOptions: (cssLoaderOptions, { env, paths }) => {
  //       return cssLoaderOptions;
  //     }
  //   },
  //   sass: {
  //     loaderOptions: {
  //       /* Any sass-loader configuration options: https://github.com/webpack-contrib/sass-loader. */
  //     },
  //     loaderOptions: (sassLoaderOptions, { env, paths }) => {
  //       return sassLoaderOptions;
  //     }
  //   },
  //   postcss: {
  //     mode: "extends" /* (default value) */ || "file",
  //     plugins: [require("plugin-to-append")], // Additional plugins given in an array are appended to existing config.
  //     plugins: (plugins) => [require("plugin-to-prepend")].concat(plugins), // Or you may use the function variant.
  //     env: {
  //       autoprefixer: {
  //         /* Any autoprefixer options: https://github.com/postcss/autoprefixer#options */
  //       },
  //       stage: 3 /* Any valid stages: https://cssdb.org/#staging-process. */,
  //       features: {
  //         /* Any CSS features: https://preset-env.cssdb.org/features. */
  //       }
  //     },
  //     loaderOptions: {
  //       /* Any postcss-loader configuration options: https://github.com/postcss/postcss-loader. */
  //     },
  //     loaderOptions: (postcssLoaderOptions, { env, paths }) => {
  //       return postcssLoaderOptions;
  //     }
  //   }
  // },
  // eslint: {
  //   enable: true /* (default value) */,
  //   mode: "extends" /* (default value) */ || "file",
  //   configure: {
  //     /* Any eslint configuration options: https://eslint.org/docs/user-guide/configuring */
  //   },
  //   configure: (eslintConfig, { env, paths }) => {
  //     return eslintConfig;
  //   },
  //   pluginOptions: {
  //     /* Any eslint plugin configuration options: https://github.com/webpack-contrib/eslint-webpack-plugin#options. */
  //   },
  //   pluginOptions: (eslintOptions, { env, paths }) => {
  //     return eslintOptions;
  //   }
  // },
  // babel: {
  //   presets: [],
  //   plugins: [],
  //   loaderOptions: {
  //     /* Any babel-loader configuration options: https://github.com/babel/babel-loader. */
  //   },
  //   loaderOptions: (babelLoaderOptions, { env, paths }) => {
  //     return babelLoaderOptions;
  //   }
  // },
  // typescript: {
  //   enableTypeChecking: true /* (default value)  */
  // },
  webpack: {
    // alias: {},
    plugins: {
      add: [
        isProd &&
          new GenerateSW({
            // cacheId: "webpack-pwa",
            clientsClaim: true,
            skipWaiting: true,
            // swDest: "service-wroker.js",
            // globIgnores: ["service-wroker.js"],
            // globPatterns: ["**/*.{html,js,css,png.jpg}"],
          }),
      ].filter(Boolean) /* An array of plugins */,
      // add: [
      //   plugin1,
      //   [plugin2, "append"],
      //   [plugin3, "prepend"] /* Specify if plugin should be appended or prepended */
      // ] /* An array of plugins */,
      // remove:
      //   [] /* An array of plugin constructor's names (i.e. "StyleLintPlugin", "ESLintWebpackPlugin" ) */
    },
    // configure: {
    //   /* Any webpack configuration options: https://webpack.js.org/configuration */
    // },
    // configure: (webpackConfig, { env, paths }) => {
    //   return webpackConfig;
    // },
  },
  // jest: {
  //   babel: {
  //     addPresets: true /* (default value) */,
  //     addPlugins: true /* (default value) */
  //   },
  //   configure: {
  //     /* Any Jest configuration options: https://jestjs.io/docs/en/configuration */
  //   },
  //   configure: (jestConfig, { env, paths, resolve, rootDir }) => {
  //     return jestConfig;
  //   }
  // },
  // devServer: {
  //   /* Any devServer configuration options: https://webpack.js.org/configuration/dev-server/#devserver */
  // },
  // devServer: (devServerConfig, { env, paths, proxy, allowedHost }) => {
  //   return devServerConfig;
  // }
};

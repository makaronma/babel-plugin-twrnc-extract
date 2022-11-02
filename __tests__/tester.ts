import pluginTester from 'babel-plugin-tester';
import plugin from '../src/index'
import { PluginOptions } from '../types';

const pluginOptions: PluginOptions = {
  twPath: "lib/utils/tw",
  acceptedJsxIdentifiers: ["Text", "View", "Image"],
};


export default (tests: Parameters<typeof pluginTester>[0]["tests"]) =>
  pluginTester({
    // prettierFormatter: {},
    pluginName: "babel-plugin-twrnc-extract",
    plugin,
    pluginOptions,
    babelOptions: {
      // filename: 'test-file.tsx',
      plugins: [
        "@babel/plugin-syntax-jsx",
      ],
    },
    tests,
  });
  
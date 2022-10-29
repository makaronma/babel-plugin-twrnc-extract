import pluginTester from 'babel-plugin-tester';
import plugin from '../src/index'

export default (tests: Parameters<typeof pluginTester>[0]["tests"]) =>
  pluginTester({
    // prettierFormatter: {},
    pluginName: "babel-plugin-twrnc-split",
    plugin,
    // pluginOptions: { deprecations: v31 },
    babelOptions: {
      // filename: 'test-file.tsx',
      plugins: [
        "@babel/plugin-syntax-jsx",
      ],
    },
    tests,
  });
  
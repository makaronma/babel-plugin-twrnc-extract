const { build } = require('esbuild')
// const { dependencies } = require('../package.json')

function getArgs() {
  const args = {};
  process.argv.forEach((arg, index) => {
    if (arg.slice(0, 2) === "--") {
      const longArg = arg.split("=");
      const longArgFlag = longArg[0].slice(2, longArg[0].length);
      const longArgValue = longArg.length > 1 ? longArg[1] : true;
      args[longArgFlag] = longArgValue;
    } else if (arg[0] === "-") {
      const flag = arg.split("-")[1];
      args[flag] = true;
    }
  });
  return args;
}
const args = getArgs();

build({
  entryPoints: ['src/index.ts'],
  outdir: 'dist',
  bundle: true,
  platform: 'node',
  target: 'es2016',
  // external: ['@babel/core', '@babel/types'].concat(Object.keys(dependencies)),
  watch: args.watch,
})

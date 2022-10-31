import pluginTester from 'babel-plugin-tester';
import dedent from 'dedent';

import tester from './tester';

const tests: Parameters<typeof pluginTester>[0]["tests"] = [
  {
    title: "Import TW (if className is added)",
    code: dedent`
      const Comp = () => <View className="flex-1"></View>;
    `,

    output: dedent`
      import tw from "./lib/tw";
      const Comp = () => <View style={twStyles._attr_str}></View>;
      const twStyles = {
        _attr_str: tw\`flex-1\`,
      };
    `,
  },

  {
    title: "Dont Import TW & add twStyles (if no className is used)",
    code: dedent`
      const Comp = () => <View></View>;
    `,
    output: dedent`
      const Comp = () => <View></View>;
    `,
  },

  {
    title: "Dont Import TW (if TW is imported already)",
    code: dedent`
      import tw from "./lib/tw";
      const Comp = () => <View className={'flex-1'}></View>;
    `,
    output: dedent`
      import tw from "./lib/tw";
      const Comp = () => <View style={twStyles._attr_exp_str}></View>;
      const twStyles = {
        _attr_exp_str: tw\`flex-1\`,
      };
    `,
  },
];

tester(tests)
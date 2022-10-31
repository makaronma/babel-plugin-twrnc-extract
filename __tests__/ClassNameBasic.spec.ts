import pluginTester from 'babel-plugin-tester';
import dedent from 'dedent';

import tester from './tester';

const tests: Parameters<typeof pluginTester>[0]["tests"] = [
  {
    title: "Transform Style (Only String)",
    code: dedent`
      const Comp = () => <View className='flex-1'></View>;
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
    title: "Transform Style (Only String in expression)",
    code: dedent`
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
  {
    title: "Transform Style (Template Literal: string)",
    code: dedent`
      const Comp = () => <View className={\`flex-1\`}></View>;
    `,
    output: dedent`
      import tw from "./lib/tw";
      const Comp = () => <View style={twStyles._attr_exp_tpl}></View>;
      const twStyles = {
        _attr_exp_tpl: tw\`flex-1\`,
      };
    `,
  },
];

tester(tests)
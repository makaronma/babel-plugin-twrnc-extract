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
      import tw from "~/lib/utils/tw";
      const Comp = () => <View style={twStyles._u}></View>;
      const twStyles = {
        _u: tw\`flex-1\`,
      };
    `,
  },
  // {
  //   title: "Transform Style (Template Literal: string)",
  //   code: dedent`
  //     const Comp = () => <View className={\`flex-1\`}></View>;
  //   `,
  //   output: dedent`
  //     import tw from "~/lib/utils/tw";

  //     const Comp = () => <View style={twStyles._u}></View>;
      
  //     const twStyles = {
  //       _u: tw\`flex-1\`,
  //     };
  //   `,
  // },
];

tester(tests)
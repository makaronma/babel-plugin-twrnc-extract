import pluginTester from 'babel-plugin-tester';
import dedent from 'dedent';

import tester from './tester';

const tests: Parameters<typeof pluginTester>[0]["tests"] = [
  {
    title: "Transform Style (Template Literal: boolean)",
    code: dedent`
      const num = 1;
      const Comp = () => <View className={\`\${num} flex-1\`}></View>;
      `,
      output: dedent`
      import tw from "./lib/tw";
      const num = 1;
      const Comp = () => <View style={twStyles._attr_exp_tpl}></View>;
      const twStyles = {
        _attr_exp_tpl: tw\`\${num} flex-1\`,
      };
    `,
  },
  {
    title: "Transform Style (Template Literal: number)",
    code: dedent`
      const Comp = () => <View className={\`w-[\${123}px] flex-1\`}></View>;
    `,
    output: dedent`
      import tw from "./lib/tw";
      const Comp = () => <View style={twStyles._attr_exp_tpl}></View>;
      const twStyles = {
        _attr_exp_tpl: tw\`w-[\${123}px] flex-1\`,
      };
    `,
  },
  {
    title: "Transform Style (Template Literal: variable)",
    code: dedent`
      const someVar = 123;
      const Comp = () => <View className={\`w-[\${someVar}px] flex-1\`}></View>;
    `,
    output: dedent`
      import tw from "./lib/tw";
      const someVar = 123;
      const Comp = () => <View style={twStyles._attr_exp_tpl}></View>;
      const twStyles = {
        _attr_exp_tpl: tw\`w-[\${someVar}px] flex-1\`,
      };
    `,
  },

  {
    title: "Transform Style (Template Literal: conditional boolean -> string)",
    code: dedent`
      const Comp = () => <View className={\`\${true ? "flex-row" : "flex-col"} flex-1\`}></View>;
    `,
    output: dedent`
      import tw from "./lib/tw";
      const Comp = () => <View style={twStyles._attr_exp_tpl}></View>;
      const twStyles = {
        _attr_exp_tpl: tw\`\${true ? "flex-row" : "flex-col"} flex-1\`,
      };
    `,
  },
  {
    title:
      "Transform Style (Template Literal: conditional func return -> string)",
    code: dedent`
      const getChoice = () => Math.random();
      const Comp = () => <View className={\`\${getChoice() ? "flex-row" : "flex-col"} flex-1\`}></View>;
    `,
    output: dedent`
      import tw from "./lib/tw";
      const getChoice = () => Math.random();
      const Comp = () => <View style={twStyles._attr_exp_tpl}></View>;
      const twStyles = {
        _attr_exp_tpl: tw\`\${getChoice() ? "flex-row" : "flex-col"} flex-1\`,
      };
    `,
  },
];

tester(tests)
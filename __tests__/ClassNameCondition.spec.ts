import pluginTester from 'babel-plugin-tester';
import dedent from 'dedent';

import tester from './tester';

const tests: Parameters<typeof pluginTester>[0]["tests"] = [
  {
    title: "Transform Style (Conditional boolean -> string)",
    code: dedent`
      const Comp = () => <View className={true ? "flex-1" : true ? true ? "flex-2" : "flex-3" : "flex-4"}></View>;
    `,
    output: dedent`
      import tw from "./lib/tw";
      const Comp = () => (
        <View
          style={
            true
              ? twStyles._attr2_conExp_conStr
              : true
              ? true
                ? twStyles._attr4_conExp_conStr
                : twStyles._attr4_conExp_altStr
              : twStyles._attr3_conExp_altStr
          }
        ></View>
      );
      const twStyles = {
        _attr2_conExp_conStr: tw\`flex-1\`,
        _attr3_conExp_altStr: tw\`flex-4\`,
        _attr4_conExp_conStr: tw\`flex-2\`,
        _attr4_conExp_altStr: tw\`flex-3\`,
      };
    `,
  },
  {
    title: "Transform Style (Conditional boolean -> template literal)",
    code: dedent`
      const someLength = 100;
      const someLength2 = 100;
      const Comp = () => <View className={true ? \`w-\${someLength}\` : \`h-\${someLength}\`}></View>;
    `,
    output: dedent`
      import tw from "./lib/tw";
      const someLength = 100;
      const someLength2 = 100;
      const Comp = () => (
        <View
          style={true ? twStyles._attr2_conExp_conTml : twStyles._attr2_conExp_altTml}
        ></View>
      );
      const twStyles = {
        _attr2_conExp_conTml: tw\`w-\${someLength}\`,
        _attr2_conExp_altTml: tw\`h-\${someLength}\`,
      };
    `,
  },
  {
    title: "Transform Style (Conditional boolean -> string + template literal)",
    code: dedent`
      const someLength = 100;

      const Comp = () => <View className={true ? \`w-\${someLength}\` : "flex-col"}></View>;
    `,
    output: dedent`
      import tw from "./lib/tw";
      const someLength = 100;
      const Comp = () => (
        <View
          style={true ? twStyles._attr2_conExp_conTml : twStyles._attr2_conExp_altStr}
        ></View>
      );
      const twStyles = {
        _attr2_conExp_altStr: tw\`flex-col\`,
        _attr2_conExp_conTml: tw\`w-\${someLength}\`,
      };
    `,
  },
  {
    title: "Transform Style (Conditional Func -> string + template literal)",
    code: dedent`
    const getChoice = () => Math.random();

    const Comp = () => <View className={getChoice() ? "flex-row" : \`flex-col\`}></View>;
    `,
    output: dedent`
      import tw from "./lib/tw";
      const getChoice = () => Math.random();
      const Comp = () => (
        <View
          style={
            getChoice()
              ? twStyles._attr2_conExp_conStr
              : twStyles._attr2_conExp_altTml
          }
        ></View>
      );
      const twStyles = {
        _attr2_conExp_conStr: tw\`flex-row\`,
        _attr2_conExp_altTml: tw\`flex-col\`,
      };
    `,
  },
];

tester(tests)
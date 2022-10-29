import pluginTester from "babel-plugin-tester";
import dedent from "dedent";
import tester from "./tester";

const tests: Parameters<typeof pluginTester>[0]["tests"] = [
  {
    title: "Style Override twStyle (style after className)",
    code: dedent`
      const Comp = () => <View className="flex-1" style={{display: "none"}}></View>;
    `,

    output: dedent`
      import tw from "~/lib/utils/tw";
      const Comp = () => (
        <View
          style={[
            twStyles._attr_str,
            {
              display: "none",
            },
          ]}
        ></View>
      );
      const twStyles = {
        _attr_str: tw\`flex-1\`,
      };
    `,
  },
  {
    title: "Style Override twStyle (className after style)",
    code: dedent`
      const Comp = () => <View style={{display: "none"}} className="flex-1"></View>;
    `,

    output: dedent`
      import tw from "~/lib/utils/tw";
      const Comp = () => (
        <View
          style={[
            twStyles._attr_str,
            {
              display: "none",
            },
          ]}
        ></View>
      );
      const twStyles = {
        _attr_str: tw\`flex-1\`,
      };
    `,
  },
  {
    title: "Style Override twStyle (style not exist)",
    code: dedent`
      const Comp = () => <View className="flex-1"></View>;
    `,

    output: dedent`
      import tw from "~/lib/utils/tw";
      const Comp = () => <View style={twStyles._attr_str}></View>;
      const twStyles = {
        _attr_str: tw\`flex-1\`,
      };
    `,
  },

  {
    title: "Style Override twStyle (className not exist)",
    code: dedent`
      const Comp = () => <View style={{display: "none"}}></View>;
    `,
    output: dedent`
      const Comp = () => (
        <View
          style={{
            display: "none",
          }}
        ></View>
      );
    `,
  },
  {
    title: "Style Override twStyle (use styleSheet)",
    code: dedent`
      const Comp = () => <View className="flex-1" style={styles.comp}></View>;
      const styles = StyleSheet.create({
        comp: {
          display: "none",
        },
      });
    `,

    output: dedent`
      import tw from "~/lib/utils/tw";
      const Comp = () => <View style={[twStyles._attr_str, styles.comp]}></View>;
      const styles = StyleSheet.create({
        comp: {
          display: "none",
        },
      });
      const twStyles = {
        _attr_str: tw\`flex-1\`,
      };
    `,
  },

  {
    title: "Style Override twStyle (style is array)",
    code: dedent`
      const Comp = () => (
        <View style={[styles.comp, styles.hi]} className="flex-1"></View>
      )
      const styles = StyleSheet.create({
        comp: {
          display: "none",
        },
        hi: {
          display: "yes",
        },
      });
      `,

      output: dedent`
      import tw from "~/lib/utils/tw";
      const Comp = () => (
        <View style={[twStyles._attr_str, styles.comp, styles.hi]}></View>
      );
      const styles = StyleSheet.create({
        comp: {
          display: "none",
        },
        hi: {
          display: "yes",
        },
      });
      const twStyles = {
        _attr_str: tw\`flex-1\`,
      };
    `,
  },

  

];

tester(tests)
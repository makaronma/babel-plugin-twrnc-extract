import babel from "@babel/core";

export default ({ types: t }: typeof babel): babel.PluginObj => {
  return {
    visitor: {
      Program(programPath, state) {
        programPath.traverse({
          StringLiteral(path, state) {
            if (path.node.value === "hi") {
              path.node.value = "test";
            }
          },
        });
      },
    },
  };
};

import babel from "@babel/core";

const defaultAcceptedJsxIdentifiers = ["View", "Text", "Image"];

export default () => ({
  isAcceptedJsx(
    node: babel.types.JSXOpeningElement,
    acceptedJsxIdentifiers: string[] = defaultAcceptedJsxIdentifiers
  ): boolean {
    return (
      node.name.type === "JSXIdentifier" &&
      acceptedJsxIdentifiers.indexOf(node.name.name) > -1
    );
  },

  hasClassNameProp(node: babel.types.JSXOpeningElement): boolean {
    const classNameAttr = node.attributes.find(
      (a) => a.type === "JSXAttribute" && a.name.name === "className"
    );

    if (!classNameAttr) return false;
    // TODO: check is empty string/template literal in expression
    return true;
  },

  // isClassName

  hasImportedTw: (
    programPath: babel.NodePath<babel.types.Program>
  ): boolean => {
    let isTwImported = false;
    programPath.traverse({
      ImportDefaultSpecifier({ node }) {
        if (node.local.name === "tw") isTwImported = true;
      },
    });
    return isTwImported;
  },
});

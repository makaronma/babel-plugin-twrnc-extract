import babel from "@babel/core";

export default (t: typeof babel.types) => ({

  isRnElement(node: babel.types.JSXOpeningElement): boolean {
    return node.name.type === "JSXIdentifier";
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
});
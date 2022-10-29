import babel from "@babel/core";
import { AttrPathType } from "../../types";

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

  isJsxAttrClassName(attrPath: AttrPathType): boolean {
    return attrPath.node.name.name === "className";
  },
});

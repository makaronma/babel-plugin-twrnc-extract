import babel from "@babel/core";
import { TwStyleList } from "../types";
import checker from "./utils/checker";
import creator from "./utils/creator";

export default ({ types: t }: typeof babel): babel.PluginObj => {
  const { isRnElement, hasClassNameProp } = checker(t);
  const { createTwStyles, createTwStylesObj } = creator(t);
  let twStyleList: TwStyleList = [];

  return {
    visitor: {
      // <---------------- File start ---------------->
      Program(programPath) {
        programPath.traverse({
          // <---------------- JSX start ---------------->
          JSXOpeningElement(jsxPath) {
            if (!isRnElement(jsxPath.node) || !hasClassNameProp(jsxPath.node)) return;
            
            const jsxId = jsxPath.scope.generateUidIdentifier("u").name;

            jsxPath.traverse({
              // <---------------- Attribute start ---------------->
              JSXAttribute(attrPath) {
                if (!attrPath.node.value || !attrPath.node.value.type) return;
                
                if (attrPath.node.name.name === "className") {
                  switch (attrPath.node.value.type) {
                    case "StringLiteral":
                      const style = createTwStyles({
                        expressionType: "StringLiteral",
                        className: attrPath.node.value.value,
                      });
                      const classId = jsxId;
                      style && twStyleList.push({ classId, style });
                      attrPath.node.value = t.jSXExpressionContainer(
                        t.memberExpression(
                          t.identifier("twStyles"),
                          t.identifier(classId)
                        )
                      );
                      break;
                    default:
                      break;
                  }
                } else if (attrPath.node.name.name === "style") {

                }
              },
              // <---------------- Attribute end ---------------->
            });
          }
          // <---------------- JSX end ---------------->
        });
        if (twStyleList.length > 0) {
          const fileBody = programPath.node.body;
          fileBody.push(createTwStylesObj(t, twStyleList));
          // if (!hasImportedTw(programPath)) fileBody.unshift(createImportTw(t));
        }
      },
      // <---------------- File end ---------------->
      
    },
  };
};

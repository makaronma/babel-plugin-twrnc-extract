import babel from '@babel/core';

import { TwStyleList } from '../types';
import checker from './utils/checker';
import creator from './utils/creator';

export default ({ types: t }: typeof babel): babel.PluginObj => {
  const { isRnElement, hasClassNameProp, hasImportedTw } = checker(t);
  const { createTwStyles, createTwStylesObj, createImportTw } = creator(t);
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
                
                // scan node inside "classname"
                if (attrPath.node.name.name === "className") {
                  switch (attrPath.node.value.type) {

                    // className="bg-white"
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

                    // className={anything...}
                    case "JSXExpressionContainer":
                      
                      break;
                    default:
                      break;
                  }
                  attrPath.node.name.name = "style";
                } else if (attrPath.node.name.name === "style") {
                  // attrPath.node.name.name="classN"
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
          if (!hasImportedTw(programPath)) fileBody.unshift(createImportTw(t));
        }
      },
      // <---------------- File end ---------------->
      
    },
  };
};

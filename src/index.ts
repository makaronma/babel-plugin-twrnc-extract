import babel from '@babel/core';

import { TwStyleList } from '../types';
import checker from './utils/checker';
import creator from './utils/creator';
import handler from './utils/handler';

export default ({ types: t }: typeof babel): babel.PluginObj => {
  return {
    visitor: {
      // <---------------- File start ---------------->
      Program(programPath) {
        
        const twStyleList: TwStyleList = [];
        const { isRnElement, hasClassNameProp, hasImportedTw, isJsxAttrClassName } = checker(t);
        const { createTwStylesObj, createImportTw } = creator(t);
        const {
          handleClassName_StringLiteral,
          handleClassName_JSXExpressionContainer,
        } = handler(t, twStyleList);

        programPath.traverse({
          // <---------------- JSX start ---------------->
          JSXOpeningElement(jsxPath) {
            if (!isRnElement(jsxPath.node) || !hasClassNameProp(jsxPath.node)) return;
            let oriStyle: babel.types.JSXExpressionContainer | undefined;
            jsxPath.traverse({
              JSXAttribute(attrPath) {
                if (attrPath.node.name.name === "style" && attrPath.node.value?.type === "JSXExpressionContainer") {
                  oriStyle = attrPath.node.value;
                  attrPath.remove();
                }
              },
              // <---------------- Attribute start ---------------->
              // <---------------- Attribute end ---------------->
            });
            jsxPath.traverse({
              // <---------------- Attribute start ---------------->
              JSXAttribute(attrPath) {
                if (!attrPath.node.value || !attrPath.node.value.type) return;
                // scan node inside "classname"
                if (attrPath.node.name.name === "className") {
                  let twExpContainer: babel.types.JSXExpressionContainer | undefined;
                  if (attrPath.node.value.type === "StringLiteral") {
                    twExpContainer = handleClassName_StringLiteral(attrPath);
                  } else if (attrPath.node.value.type === "JSXExpressionContainer") {
                    twExpContainer = handleClassName_JSXExpressionContainer(attrPath);
                  }
                  if (
                    oriStyle &&
                    oriStyle.expression.type !== "JSXEmptyExpression" &&
                    twExpContainer &&
                    twExpContainer.expression.type !== "JSXEmptyExpression"
                  ) {
                    const oriExp = oriStyle.expression;
                    const twExp = twExpContainer.expression;
                    const updatedStyleExpContainer = t.jSXExpressionContainer(
                      t.arrayExpression(
                        oriExp.type === "ArrayExpression"
                          ? [twExp, ...oriExp.elements]
                          : [twExp, oriExp]
                      )
                    );
                    attrPath.node.value = updatedStyleExpContainer;
                  }
                }
              },
              // <---------------- Attribute end ---------------->
            });
          }
          // <---------------- JSX end ---------------->
        });
        if (twStyleList.length > 0) {
          const fileBody = programPath.node.body;
          fileBody.push(createTwStylesObj(twStyleList));
          if (!hasImportedTw(programPath)) fileBody.unshift(createImportTw());
        }
      },
      // <---------------- File end ---------------->
      
    },
  };
};

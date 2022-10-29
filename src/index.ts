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
            
            const jsxId = jsxPath.scope.generateUidIdentifier("jsx").name;

            jsxPath.traverse({
              // <---------------- Attribute start ---------------->
              JSXAttribute(attrPath) {
                if (!attrPath.node.value || !attrPath.node.value.type) return;
                
                // scan node inside "classname"
                if (attrPath.node.name.name==='className') {
                  if (attrPath.node.value.type === "StringLiteral") {
                    handleClassName_StringLiteral(attrPath);
                  } else if (
                    attrPath.node.value.type === "JSXExpressionContainer"
                  ) {
                    handleClassName_JSXExpressionContainer(attrPath);
                  }
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
          fileBody.push(createTwStylesObj(twStyleList));
          if (!hasImportedTw(programPath)) fileBody.unshift(createImportTw());
        }
      },
      // <---------------- File end ---------------->
      
    },
  };
};

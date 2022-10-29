import babel from '@babel/core';

import { TwStyleList } from '../types';
import checker from './utils/checker';
import creator from './utils/creator';
import getter from './utils/getter';
import handler from './utils/handler';

export default ({ types: t }: typeof babel): babel.PluginObj => {
  return {
    visitor: {
      // <---------------- File start ---------------->
      Program(programPath) {
        
        const twStyleList: TwStyleList = [];
        const { isRnElement, hasClassNameProp, hasImportedTw, isJsxAttrClassName } = checker(t);
        const { createTwStylesObj, createImportTw } = creator(t);
        const { getCombinedExpressionContainer } = getter(t);
        const {
          handleClassName_StringLiteral,
          handleClassName_JSXExpressionContainer,
        } = handler(t, twStyleList);

        programPath.traverse({
          // <---------------- JSX start ---------------->
          JSXOpeningElement(jsxPath) {
            if (!isRnElement(jsxPath.node) || !hasClassNameProp(jsxPath.node)) return;
            let oriStyle: babel.types.JSXExpressionContainer | undefined;

            // tmp store original style expression container & remove it
            jsxPath.traverse({
              JSXAttribute(attrPath) {
                if (attrPath.node.name.name === "style" && attrPath.node.value?.type === "JSXExpressionContainer") {
                  oriStyle = attrPath.node.value;
                  attrPath.remove();
                }
              },
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

                  // combine the original style exp container & twStyle exp container
                  if (oriStyle && twExpContainer) {
                    const updatedStyleExpContainer = getCombinedExpressionContainer(oriStyle, twExpContainer);
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

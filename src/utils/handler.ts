import babel from "@babel/core";
import { AttrPathType, TwStyleList } from "../../types";
import creator from "./creator";

export default (t: typeof babel.types, twStyleList: TwStyleList) => ({

  /** @handle className="flex-1" */
  handleClassName_StringLiteral(attrPath: AttrPathType) : babel.types.JSXExpressionContainer | undefined {
    if (attrPath.node.value?.type !== "StringLiteral") return;
    const { createTwStylesFromString, createStyleExpressionContainer }  = creator(t);
    const attrPathId = attrPath.scope.generateUidIdentifier("attr").name;
    const classId = `${attrPathId}_str`;

    const style = createTwStylesFromString(attrPath.node.value.value);

    if (style) twStyleList.push({ classId, style });

    attrPath.node.value = createStyleExpressionContainer(classId);
    attrPath.node.name.name = "style";

    return attrPath.node.value;
  },

  /** @handle className={...anything...} */
  handleClassName_JSXExpressionContainer(attrPath: AttrPathType) : babel.types.JSXExpressionContainer | undefined  {
    if (attrPath.node.value?.type !== "JSXExpressionContainer") return;
    const { createTwStylesFromString, createStyleExpression, createStyleExpressionContainer, createTwStylesFromTml } = creator(t);
    const attrPathId = attrPath.scope.generateUidIdentifier("attr").name;
    const expression = attrPath.node.value.expression;

    switch (expression.type) {
      /** @handle className={"flex-1"} */
      case "StringLiteral": {
        const classId = `${attrPathId}_exp_str`;
        const style = createTwStylesFromString(expression.value);

        if (style) twStyleList.push({ classId, style });

        attrPath.node.name.name = "style";
        attrPath.node.value = createStyleExpressionContainer(classId);
        return attrPath.node.value;
      }

      /** @handle className={`flex-1 ${anyOtherVariables}`} */
      case "TemplateLiteral": {
        const classId = `${attrPathId}_exp_tpl`;
        
        twStyleList.push({ classId, style: createTwStylesFromTml(expression) });
        
        attrPath.node.name.name = "style";
        attrPath.node.value = createStyleExpressionContainer(classId);
        return attrPath.node.value;
      }
      
      /** @handle className={true ? "flex-1" : "flex-2"} */
      case "ConditionalExpression": {
        // loop through all consequences & alternates
        attrPath.traverse({
          ConditionalExpression(conExpPath) {
            const node = conExpPath.node;
            const conExpPathId = conExpPath.scope.generateUidIdentifier(attrPathId).name + "_conExp";
            
            if (node.consequent.type === 'StringLiteral') {
              const classId = `${conExpPathId}_conStr`;
              const style = createTwStylesFromString(node.consequent.value);
              
              style && twStyleList.push({ classId, style });
              node.consequent = createStyleExpression(classId)
            }
            
            if (node.alternate.type === 'StringLiteral') {
              const classId = `${conExpPathId}_altStr`;
              const style = createTwStylesFromString(node.alternate.value);
              
              style && twStyleList.push({ classId, style });
              node.alternate = createStyleExpression(classId)
            }

            if (node.consequent.type === 'TemplateLiteral') {
              const classId = `${conExpPathId}_conTml`;
              const style = createTwStylesFromTml(node.consequent)

              twStyleList.push({ classId, style });
              node.consequent = createStyleExpression(classId)
            }
            if (node.alternate.type === 'TemplateLiteral') {
              const classId = `${conExpPathId}_altTml`;
              const style = createTwStylesFromTml(node.alternate)

              twStyleList.push({ classId, style });
              node.alternate = createStyleExpression(classId)
            }

          },
        });
        attrPath.node.name.name = "style";
        return attrPath.node.value;
      }

      default:
        break;
    }

  },
});
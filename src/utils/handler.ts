import babel from "@babel/core";
import { AttrPathType, TwStyleList } from "../../types";
import creator from "./creator";

export default (t: typeof babel.types, twStyleList: TwStyleList) => ({

  // className="flex-1"
  handleClassName_StringLiteral(attrPath: AttrPathType) {
    if (attrPath.node.value?.type !== "StringLiteral") return;
    const { createTwStyles, createStyleExpression }  = creator(t);
    const attrPathId = attrPath.scope.generateUidIdentifier("attr").name;
    const classId = `${attrPathId}_str`;

    const style = createTwStyles({
      expressionType: "StringLiteral",
      className: attrPath.node.value.value,
    });

    if (style) twStyleList.push({ classId, style });

    attrPath.node.value = createStyleExpression(classId);
    attrPath.node.name.name = "style";
  },

  // className={...anything...}
  handleClassName_JSXExpressionContainer(attrPath: AttrPathType) {
    if (attrPath.node.value?.type !== "JSXExpressionContainer") return;
    const { createTwStyles, createStyleExpression } = creator(t);
    const attrPathId = attrPath.scope.generateUidIdentifier("attr").name;
    const expression = attrPath.node.value.expression;

    switch (expression.type) {
      // className={"flex-1"}
      case "StringLiteral": {
        const style = createTwStyles({
          expressionType: "StringLiteral",
          className: expression.value,
        });
        const classId = `${attrPathId}_exp_str`;

        if (style) twStyleList.push({ classId, style });

        attrPath.node.name.name = "style";
        attrPath.node.value = createStyleExpression(classId);
        break;
      }
      // className={`flex-1 ${anyOtherVariables}`}
      case "TemplateLiteral": {
        const classId = `${attrPathId}_exp_tpl`;

        twStyleList.push({
          classId,
          style: t.taggedTemplateExpression(t.identifier("tw"), expression),
        });

        attrPath.node.name.name = "style";
        attrPath.node.value = createStyleExpression(classId);
        break;
      }
      default:
        break;
    }
  },
});
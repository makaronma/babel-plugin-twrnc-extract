import babel from "@babel/core";

export default (t: typeof babel.types) => ({

  /**
   * @description left containers override right containers
   */
  getCombinedExpressionContainer(
    ...containers: babel.types.JSXExpressionContainer[]
  ): babel.types.JSXExpressionContainer | undefined {
    
    const updatedStyleExpContainer = containers.reduce<
      babel.types.JSXExpressionContainer | undefined
    >((prevContainer, currContainer) => {
      if (!prevContainer) return currContainer;

      if (
        prevContainer.expression.type === "JSXEmptyExpression" ||
        currContainer.expression.type === "JSXEmptyExpression"
      ) return prevContainer;
      
      const prevExp = prevContainer.expression;
      const currExp = currContainer.expression;

      if (prevExp.type === "ArrayExpression") {
        return t.jSXExpressionContainer(
          t.arrayExpression([currExp, ...prevExp.elements])
        );
      }

      if (currExp.type === "ArrayExpression") {
        return t.jSXExpressionContainer(
          t.arrayExpression([...currExp.elements, prevExp])
        );
      }

      return t.jSXExpressionContainer(t.arrayExpression([currExp, prevExp]));
    }, undefined);

    return updatedStyleExpContainer
  },
});
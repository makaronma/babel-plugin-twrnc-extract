import babel from "@babel/core";
import { TwStyleList } from "../../types";

export default (t: typeof babel.types) => ({
  createTwStylesFromString: (className: string): babel.types.TaggedTemplateExpression | undefined => {
    return t.taggedTemplateExpression(
      t.identifier("tw"),
      t.templateLiteral(
        [
          t.templateElement({
            raw: className,
            cooked: className,
          }),
        ],
        []
      )
    );
  },

  createTwStylesFromTml: (tpl: babel.types.TemplateLiteral): babel.types.TaggedTemplateExpression => {
    return t.taggedTemplateExpression(t.identifier("tw"), tpl);
  },

  createTwStylesObj: (
    twStyleList: TwStyleList
  ): babel.types.VariableDeclaration => {
    return t.variableDeclaration("const", [
      t.variableDeclarator(
        t.identifier("twStyles"),
        t.objectExpression(
          twStyleList.map((c) =>
            t.objectProperty(t.identifier(c.classId), c.style)
          )
        )
      ),
    ]);
  },

  createImportTw: (relativePath: string): babel.types.ImportDeclaration => {
    return t.importDeclaration(
      [t.importDefaultSpecifier(t.identifier("tw"))],
      t.stringLiteral(relativePath)
    );
  },

  createStyleExpression: (classId: string) => {
    return t.memberExpression(t.identifier("twStyles"), t.identifier(classId))
  },

  createStyleExpressionContainer: (classId: string) => {
    return t.jSXExpressionContainer(
      t.memberExpression(t.identifier("twStyles"), t.identifier(classId))
    );
  },

});
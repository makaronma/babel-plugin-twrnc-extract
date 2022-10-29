import babel from "@babel/core";
import { TwStyleList } from "../../types";


const classNameExpressionType = [
  "StringLiteral",
  "ConditionalExpression",
  "TemplateLiteral",
] as const;

type AcceptClassNameExpressionType<
  T extends typeof classNameExpressionType[number]
> = Extract<typeof classNameExpressionType[number], T>;

interface CreateTwStylesProps {
  className: string;
  expressionType: AcceptClassNameExpressionType<"StringLiteral">;
}

export default (t: typeof babel.types) => ({
  createTwStyles: (
    props: CreateTwStylesProps
  ): babel.types.TaggedTemplateExpression | undefined => {
    const { className, expressionType } = props;

    switch (expressionType) {
      case "StringLiteral": {
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
      }

      default:
        return undefined;
    }
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

  createImportTw: (): babel.types.ImportDeclaration => {
    return t.importDeclaration(
      [t.importDefaultSpecifier(t.identifier("tw"))],
      t.stringLiteral("~/lib/utils/tw")
    );
  },

  createStyleExpression: (classId: string) => {
    return t.jSXExpressionContainer(
      t.memberExpression(t.identifier("twStyles"), t.identifier(classId))
    );
  },
});
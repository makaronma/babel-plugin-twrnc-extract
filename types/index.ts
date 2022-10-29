export type TwStyleList = {
  classId: string;
  style: babel.types.TaggedTemplateExpression;
}[];

export type AttrPathType = babel.NodePath<babel.types.JSXAttribute>
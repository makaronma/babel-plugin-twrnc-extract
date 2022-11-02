export type TwStyleList = {
  classId: string;
  style: babel.types.TaggedTemplateExpression;
}[];

export interface PluginOptions {
  twPath?: string;
  acceptedJsxIdentifiers?: string[];
}
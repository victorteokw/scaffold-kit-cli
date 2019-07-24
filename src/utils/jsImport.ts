interface JsImportOption {
  [key: string]: any
}

const jsImport = (options: JsImportOption, pkgName: string, indent: number = 2): string => {
  return `const {\n${' '.repeat(indent)}` +
  Object.keys(options).sort().filter((o) => options[o]).join(`,\n${' '.repeat(indent)}`)
  + `\n} = require("${pkgName}");`;
};

export default jsImport;

interface TsImportOption {
  [key: string]: any
}

const tsImport = (options: TsImportOption, pkgName: string, indent: number = 2): string => {
  return `import {\n${' '.repeat(indent)}` +
  Object.keys(options).sort().filter((o) => options[o]).join(`,\n${' '.repeat(indent)}`)
  + `\n} from "${pkgName}";`;
};

export default tsImport;

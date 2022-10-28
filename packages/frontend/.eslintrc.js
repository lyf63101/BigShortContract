module.exports = {
  root: true,
  env: {
    es2021: true,
    browser: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  plugins: ["prettier"],
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "plugin:testing-library/react",
  ],
  rules: {
    "prettier/prettier": [
      "error",
      {
        printWidth: 100, //一行的字符数，如果超过会进行换行，默认为80
        tabWidth: 2, //一个tab代表几个空格数，默认为80
        useTabs: false, //是否使用tab进行缩进，默认为false，表示用空格进行缩减
        singleQuote: false, //字符串是否使用单引号，默认为false，使用双引号
        semi: true, //行位是否使用分号，默认为true
        trailingComma: "es5", //是否使用尾逗号，有三个可选值"<none|es5|all>"
        bracketSpacing: true, //对象大括号直接是否有空格，默认为true，效果：{ foo: bar }
        parser: "babel-ts", //代码的解析引擎，https://prettier.io/docs/en/options.html#parser。
      },
    ],
    "@typescript-eslint/ban-ts-comment": 0,
    "no-restricted-globals": ["error", "event", "fdescribe"],
  },
};

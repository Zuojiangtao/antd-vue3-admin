<h1 align="center">antd-vue3-admin</h1>

<div align="center">
一个基于vue3，vite4和ant-design-vue4的中后台开发模板工程。
</div>

**中文** | [English](README.md)

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (禁用Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support for `.vue` Imports in TS

默认情况下，TypeScript 无法处理 .vue 导入的类型信息，因此我们将 tsc CLI 替换为 vue-tsc 以进行类型检查。在编辑器中，我们需要 [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) 来让 TypeScript 语言服务识别 .vue 类型。

如果您觉得独立的 TypeScript 插件不够快，Volar 还实现了性能更高的[接管模式](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669)。您可以通过以下步骤启用它：

1. 禁用内置的 TypeScript 扩展
  1) 从 VSCode 的命令面板运行 `Extensions: Show Built-in Extensions` 
  2) 找到 `TypeScript and JavaScript Language Features` ，右键单击并选择 `Disable (Workspace)` 
2. 通过从命令面板运行“Developer: Reload Window”重新加载 VSCode 窗口.

## Customize configuration

查看 [配置 Vite](https://cn.vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
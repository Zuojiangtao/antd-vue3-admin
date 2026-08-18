---
name: code-review
description: >-
  Vue 3 + TypeScript + Ant Design Vue 项目代码审查工作流。当用户要求审查代码、review 代码、
  检查代码质量、提交前自查时使用此 skill。触发场景包括："审查代码"、"code review"、
  "帮我检查这段代码"、"代码有什么问题"、"提交前检查"、"优化这段代码"等。
license: MIT
metadata:
  author: zuojt
  version: "1.0"
---

# 代码审查工作流

对项目代码执行审查时，按以下流程执行：

1. 确定审查范围（指定文件、目录或改动 diff）
2. 优先运行机器检查：`pnpm lint`、`pnpm type-check`（工具报错优先于人工清单）
3. 按 L1 → L2 → L3 优先级逐维度检查（L1 必须全部通过）
4. 按文末格式输出审查结论

## 检查清单

### 1. 语法与格式（L1 - 必须通过）

- 代码能通过 `pnpm lint` 无错误，`pnpm type-check` 无类型错误
- 缩进统一（2 空格），无混用 tab/space
- 文件末尾有空行（EOF newline）
- 无多余的空行（≤ 2 个连续空行）
- 无未使用的 import
- 无 console.log（生产代码中）
- 无 debugger 语句（生产代码中）
- 注释代码已清理或有 TODO/FIXME 标记说明原因

### 2. 命名规范（L1 - 必须通过）

- Vue 组件文件使用 PascalCase，TypeScript 文件使用 camelCase，目录使用 kebab-case
- 变量/函数名语义清晰，无单字母命名（循环变量除外）
- 事件处理函数以 `handle` 前缀命名（如 `handleSubmit`）
- 布尔变量以 `is/has/can` 前缀命名（如 `isLoading`、`hasPermission`）

### 3. 自动导入合规（L1 - 必须通过，本项目特有，已由 ESLint `no-restricted-imports` 强制 src/views/**）

- 无手动 import `vue`/`vue-router`/`pinia`/`axios`/项目 hooks/`src/components` 公共组件
- `message`/`Modal`/`notification` 等函数式 API 已正确手动导入
- 未手动修改 `types/auto-imports.d.ts`、`types/components.d.ts`

### 4. TypeScript 类型安全（L2 - 重点关注）

- 所有 Props 有明确的 TypeScript 接口定义
- 所有 Emits 有类型声明
- 无 `any` 类型使用（新代码中，ESLint 未拦截需人工把关）
- 无 `@ts-ignore` 注释；`@ts-expect-error` 附带说明
- 无 `const enum`（esbuild 下跨文件不可靠，应使用 `as const` 对象）
- API 接口函数有完整的请求参数和响应类型定义（`src/api/<module>.ts`）
- `reactive` 对象的类型推断正确
- 可选属性使用了 `?.` 可选链和 `??` 空值合并

### 5. Vue 组件规范（L2 - 重点关注）

- 使用 `<script setup lang="ts">` 语法糖
- 组件内代码顺序：imports → Props/Emits → 响应式数据 → computed → watch → 方法 → 生命周期 → defineExpose
- 样式使用 `<style lang="less" scoped>` 避免污染
- 大组件合理拆分为子组件（单文件 ≤ 300 行），私有子组件放同级 `_components/`
- 没有在 `computed` 中产生副作用
- 没有在 `watch`/`watchEffect` 中修改监听源数据（避免死循环）
- `v-for` 必须绑定 `:key`
- `v-if` 和 `v-for` 不同时出现在同一元素（ESLint 已关闭该规则，人工审查执行）

### 6. 逻辑与结构（L2 - 重点关注）

- 函数单一职责，无超过 100 行的函数
- 无深层嵌套（≤ 4 层 if/for）
- 重复代码已提取为公共函数或 hooks
- 魔法数字/字符串已提取为常量或字面量联合类型
- 异步操作有正确的错误处理（try-catch-finally）
- Loading 状态有恰当的 UI 反馈

### 7. 安全审查（L3 - 必须关注）

- 用户输入有前端验证（表单 rules）
- Token 由 `src/utils/request.ts` 拦截器统一携带，未在前端代码硬编码密钥等敏感信息
- 敏感操作有二次确认（删除等使用 `Modal.confirm` / `showDelTableFormDialog`）
- 路由有权限守卫（`constantRouterMap`/`asyncRouterMap` 区分，配合 `src/stores/permission.ts`）
- 环境变量通过 `import.meta.env` 访问，未使用 `process.env`（客户端代码）

### 8. 性能审查（L3 - 建议关注）

- 大列表使用分页而非一次性加载（`useCurd` 默认分页）
- 路由组件使用懒加载
- 高频事件有防抖/节流处理（搜索输入可用 `useDebounceFn`，`useCurd` 已内置）
- computed 替代了不必要的 method 调用
- 大体积第三方库按需/动态导入

### 9. 可维护性（L3 - 建议关注）

- 复杂逻辑有注释说明
- API 接口函数与页面逻辑分离（`src/api/` 与 `src/views/` 分层）
- 枚举/常量统一定义，多处复用的抽取到公共位置（如 `src/enums/`，按需创建）
- 列表/表单场景优先使用项目已有的 hooks（`useCurd`、`useTable`、`useForm`、`useFormModel`）
- 未引用脚手架遗留文件（`HelloWorld.vue`、`HomeView.vue`、`AboutView.vue`、`stores/counter.ts` 等）

## 审查结论输出格式

审查完成后，输出以下格式的结论：

```
## 代码审查结果

**评分**：X/10

**严重问题**（必须修复）：
- [文件:行号] 问题描述

**建议改进**（推荐修复）：
- [文件:行号] 建议内容

**亮点**（值得保留的做法）：
- 好的实践描述
```

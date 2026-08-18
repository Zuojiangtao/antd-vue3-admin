---
name: mcp-mastergo
description: >-
  MasterGo 设计稿转代码工作流。当用户提供 MasterGo 设计稿链接、
  要求根据设计稿生成前端页面代码、或需要将 UI 设计还原为 Vue 组件时，
  使用此 skill。触发场景包括："根据设计稿实现"、"还原设计稿"、
  "MasterGo 转代码"、"设计稿生成页面"、"这个页面照着做"等。
license: MIT
metadata:
  author: zuojt
  version: "1.0"
---

# MasterGo 设计稿转代码工作流

通过 MasterGo Magic MCP 读取设计稿信息，将其精准还原为符合项目规范的 Vue 3 组件代码。

## 前置条件

- MCP Server `MasterGo Magic MCP` 已连接
- 用户提供了有效的 MasterGo 设计稿链接或文件标识
- 了解项目的 UI 组件库：Ant Design Vue 4.2.x

## 执行流程

### Step 1: 读取设计稿信息

使用 MasterGo Magic MCP 工具提取设计稿的完整信息：

1. **获取设计稿节点结构**：使用 `mcp__getDsl` 读取设计稿的 DSL 结构
2. **获取设计转代码映射**：使用 `mcp__getD2c` 获取自动转换的代码映射
3. **获取组件元数据**：使用 `mcp__getMeta` 获取设计稿的元数据信息
4. **获取组件链接**：使用 `mcp__getComponentLink` 获取组件库链接和变体信息

**错误处理**：
- 读取设计稿信息失败 → **立即停止任务**，告知用户
- Token 权限受限 → **立即停止任务**，告知用户
- 遇到无法识别的节点 → 记录但不阻塞整体流程

### Step 2: 设计稿分析与组件映射

将设计稿中的元素映射到 Ant Design Vue 组件：

| 设计稿元素 | Ant Design Vue 组件 | 说明 |
|-----------|-------------------|------|
| 文本框/输入区域 | `<a-input>` / `<a-textarea>` | 根据设计判断单行或多行 |
| 下拉选择 | `<a-select>` | 注意下拉选项数据 |
| 表格 | `<a-table>` | 配置 columns + dataSource |
| 按钮 | `<a-button>` | 区分 type: primary/default/danger/link |
| 弹窗/对话框 | `<a-modal>` | 设置 `:maskClosable="false"` |
| 表单 | `<a-form>` + `<a-form-item>` | 配置 label-col、rules |
| 树形控件 | `<a-tree>` / `<a-tree-select>` | 树形结构数据 |
| 标签/徽章 | `<a-tag>` / `<a-badge>` | 状态展示 |
| 搜索区域 | `<a-row>` + `<a-col>` | 栅格布局，默认 `:span="8"` |
| 卡片容器 | `<a-card>` | 内容分区 |
| 分页 | `<a-pagination>` 或 table 内置 | 复用 useCurd 中的 pagination |

**映射原则**：
- **严格按设计稿还原**，不擅自增删元素
- **优先使用 Ant Design Vue 组件**，不自行造轮子
- **复用项目已有封装**：列表用 `useCurd`，表单用 `useFormModel`

### Step 3: 列表场景识别与复用

如设计稿涉及列表/表格页面，参考以下标准模式：

- **参考模板**：`src/views/permission/menu/index.vue`
- **上方搜索区**：左侧「新建」按钮，右侧 `<a-input>` 模糊查询
- **表格区**：使用 `<a-table>` 组件
- **弹窗**：在 `_components/FormModel.vue` 中实现新建/编辑

复用项目已有 hooks：
- `@/hooks/useCurd.ts` — 列表增删改查公共逻辑
- `@/hooks/useTable.ts` — 表格高度计算等
- `@/hooks/useFormModel.ts` — 表单弹窗公共逻辑
- `@/hooks/useForm.ts` — 表单处理

### Step 4: 生成代码

根据分析结果生成 Vue 3 组件代码，遵循以下规范：

**组件结构**：
```vue
<script setup lang="ts">
// 1. 导入依赖（第三方 → @/ → 相对路径）
// 2. Props / Emits 类型定义
// 3. 响应式数据
// 4. computed 计算属性
// 5. watch 监听
// 6. 方法
// 7. 生命周期
</script>

<template>
  <!-- 模板内容 -->
</template>

<style lang="less" scoped>
/* 样式内容 */
</style>
```

**代码质量要求**：
- 使用 `<script setup lang="ts">` 语法糖
- Props/Emits 有完整 TypeScript 类型定义
- 样式使用 `<style lang="less" scoped>` 避免污染
- 单文件不超过 300 行，超过需拆分组件
- 代码需通过 `pnpm lint` 检查

**不要覆盖原有样式**：
- Ant Design Vue 原始组件样式无需覆盖
- 项目已有全局样式覆盖在 `src/style/pui/` 下，可直接复用
- 自定义样式写在 `<style scoped>` 中

### Step 5: 文件落位

按项目规范将生成的文件放入正确位置：

| 文件类型 | 位置 | 命名 |
|---------|------|------|
| 列表页面 | `src/views/{module}/index.vue` | `index.vue` |
| 表单弹窗 | `src/views/{module}/_components/FormModel.vue` | `FormModel.vue` |
| 表格列配置 | `src/views/{module}/_components/columns.ts` | `columns.ts` |
| API 接口 | `src/api/{module}.ts` | camelCase |
| 公共组件 | `src/components/` | PascalCase |
| 类型定义 | `types/` 或模块内部 | camelCase |

**验证检查**：
- 资源文件必须放在 `src/assets/` 下
- 引用必须使用 `@/` 路径别名

## 关键约束

- **忠实还原**：严格按设计稿实现，不擅自变更或增删元素
- **组件优先**：优先使用 Ant Design Vue 组件和项目已有封装
- **列表场景**：按 `list` 规则模板实现，功能齐全且样式统一
- **质量过关**：生成的代码需通过 ESLint 检查和 TypeScript 类型检查

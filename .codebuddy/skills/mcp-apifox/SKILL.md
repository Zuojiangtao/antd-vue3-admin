---
name: mcp-apifox
description: >-
  Apifox MCP 接口对接工作流。当用户需要对接后端接口、生成 API 请求函数、
  根据 Swagger 文档封装接口、或对接列表页面数据时，使用此 skill。
  触发场景包括："对接接口"、"生成 API"、"根据文档封装请求"、
  "读取 Swagger 文档"、"接口对接"、"添加接口调用"等。
license: MIT
metadata:
  author: zuojt
  version: "1.0"
---

# Apifox MCP 接口对接工作流

通过 Apifox MCP Server 读取后端 Swagger 文档，自动生成 TypeScript 请求函数并完成页面数据对接。

## 前置条件

- MCP Server `Apifox Mcp Server` 已连接
- 项目已有的工具函数：`@/utils/request`（axios 实例封装）
- 项目已有的 hooks：`@/hooks/useCurd.ts`（列表增删改查封装）

## 执行流程

### Step 1: 读取接口文档

使用 Apifox MCP Server 工具读取 Swagger 文档：

1. 首先用 `read_project_oas_52281m` 获取完整的 API 文档结构
2. 如遇资源引用（`$ref`），用 `read_project_oas_ref_resources_52281m` 解析

**注意事项**：
- 只读取对话上下文中指定的模块或接口，无需遍历全部文档
- 可忽略以下内容：`Authorize`、`SwaggerModels`、`文档管理`
- 关注路径、方法、请求参数、返回数据结构

### Step 2: 生成 TypeScript 请求函数

根据文档信息，在 `src/api/` 目录下生成或更新请求函数文件。

**文件组织规则**：
- 按模块合并为一个文件（如 `dataSource.ts`、`user.ts`）
- 如果已有文件则在原文件上新增，没有则创建新文件
- 指定某个模块/接口改动时，删除已有接口函数，读取最新文档后重写

**代码规范**：
- 使用 `@/utils/request` 作为 axios 实例
- 截取掉接口路径的 basePath 部分（本地做了代理）
- 为请求参数和响应数据生成完整的 TypeScript 类型定义
- 函数命名：`getXxxList`、`createXxx`、`updateXxx`、`deleteXxxById`

**模板示例**：

```typescript
import request from '@/utils/request';

const moduleUrl = {
  list: '/module-path/list',
  create: '/module-path/create',
  update: '/module-path/update',
  delete: '/module-path/delete',
};

// --- 类型定义 ---
interface XxxListParams {
  pageNum?: number;
  pageSize?: number;
  keyword?: string;
}

interface XxxItem {
  id: string;
  name: string;
  status: number;
  createTime: string;
}

interface PageResult<T> {
  records: T[];
  total: number;
  size: number;
  current: number;
}

// --- 请求函数 ---
export const getXxxList = (params: XxxListParams) => {
  return request<PageResult<XxxItem>>({
    url: moduleUrl.list,
    method: 'GET',
    params,
  });
};

export const createXxx = (data: Omit<XxxItem, 'id' | 'createTime'>) => {
  return request<XxxItem>({
    url: moduleUrl.create,
    method: 'POST',
    data,
  });
};

export const updateXxx = (data: Partial<XxxItem> & { id: string }) => {
  return request<XxxItem>({
    url: moduleUrl.update,
    method: 'PUT',
    data,
  });
};

export const deleteXxxById = (id: string) => {
  return request<void>({
    url: `${moduleUrl.delete}/${id}`,
    method: 'DELETE',
  });
};
```

### Step 3: 对接列表页面

将生成的接口函数集成到列表页面中。

**使用 `useCurd` hook 的标准模式**：

```vue
<script setup lang="ts">
import FormModel from './_components/FormModel.vue';
import { columns } from './_components/columns';
import { useCurd } from '@/hooks/useCurd.ts';
import { getXxxList, createXxx, updateXxx, deleteXxxById } from '@/api/moduleName';

const query = reactive({ searchType: 1 });
const curdMethod = {
  fetch: getXxxList,
  add: createXxx,
  del: deleteXxxById,
  edit: updateXxx,
};

const {
  formModelRef,
  fuzzyContent,
  data,
  loading,
  pagination,
  showDelTableFormDialog,
  submitMethod,
  handlePageChange,
} = useCurd(curdMethod, query);
</script>
```

**表格 columns 文件**根据接口文档返回的字段更新：

```typescript
import type { TableColumnType } from 'ant-design-vue';

type TableDataType = {
  id: string;
  name: string;
  status: string;
  createTime: string;
  action: null;
};

export const columns: TableColumnType<TableDataType>[] = [
  { title: 'ID', dataIndex: 'id', width: 80, fixed: 'left' },
  { title: '名称', dataIndex: 'name', width: 200, ellipsis: true },
  { title: '状态', dataIndex: 'status', width: 100 },
  { title: '创建时间', dataIndex: 'createTime', width: 180 },
  { title: '操作', dataIndex: 'action', width: 150, fixed: 'right' },
];
```

## 关键约束

- 所有生成的代码必须符合项目的 ESLint + Prettier 规范
- API 路径须去掉 basePath 前缀
- 列表场景复用 `useCurd` hook，保持代码风格统一
- 已有文件存在时做增量更新，勿全量重写不相关部分

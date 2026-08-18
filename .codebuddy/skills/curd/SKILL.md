---
name: curd
description: >-
  列表页面 CRUD 全链路开发工作流。当用户需要开发列表页面、新建/编辑弹窗表单、 根据接口文档刷新字段并对接接口时，使用此 skill。 触发场景包括："开发列表页"、"新建列表"、"CRUD页面"、"列表页面对接接口"、 "生成列表页面"、"创建增删改查页面"、"表单弹窗"等。

license: MIT
metadata:
  author: zuojt
  version: '1.0'
---

# 列表页面 CRUD 全链路开发工作流

基于项目 `useCurd` + `useFormModel` hooks 体系，快速生成完整的列表页面、新建/编辑弹窗表单，并根据接口文档自动刷新字段和对接接口。

## 前置条件

- 项目已有的 hooks：`@/hooks/useCurd.ts`（列表增删改查）、`@/hooks/useFormModel.ts`（表单弹窗）、`@/hooks/useTable.ts`（表格状态）
- 项目已有的请求封装：`@/utils/request`（axios 实例）
- UI 组件库：Ant Design Vue 4.2（自动导入，无需手动 import）
- 自动导入：Vue API、Ant Design Vue 组件、项目 hooks 均无需手动 import

## 核心文件结构

每个列表模块遵循统一的文件组织：

```
src/views/{module}/{page}/
├── index.vue                  # 列表页面
└── _components/
    ├── FormModel.vue          # 新建/编辑弹窗表单
    └── columns.ts             # 表格列配置
```

```
src/api/{module}.ts            # API 请求函数（按模块合并）
```

## 执行流程

### Step 1: 收集信息

在开始生成代码之前，需要确认以下信息：

1. **模块名称**：确定页面所属业务模块（如 `permission`、`system`）
2. **页面名称**：确定页面标识（如 `user`、`role`、`config`）
3. **接口文档**：如果需要对接接口，使用 Apifox MCP 读取接口文档（调用 `mcp-apifox` skill）
4. **字段信息**：从接口文档或用户提供的需求中提取字段列表

### Step 2: 生成 API 请求函数

在 `src/api/` 目录下生成或更新请求函数文件。

**文件组织规则**：

- 按模块合并为一个文件（如 `system.ts`、`permission.ts`）
- 已有文件则在原文件上新增，没有则创建新文件

**代码规范**：

- 使用 `@/utils/request` 作为 axios 实例
- 截掉接口路径的 basePath 部分（本地做了代理）
- 为请求参数和响应数据生成完整的 TypeScript 类型定义
- 函数命名：`getXxxList`、`createXxx`、`updateXxx`、`deleteXxxById`

**模板**：

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
  keyword?: string;
}

interface XxxItem {
  id: string;
  // 根据接口文档字段填充
  action: null;
}

// useCurd 从 res.data.list / res.data.total 读取分页数据，字段名必须一致
interface PageResult<T> {
  list: T[];
  total: number;
}

// --- 请求函数 ---
export const getXxxList = (params: XxxListParams) => {
  return request<PageResult<XxxItem>>({
    url: moduleUrl.list,
    method: 'GET',
    params,
  });
};

export const createXxx = (data: Omit<XxxItem, 'id' | 'action'>) => {
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

### Step 3: 生成表格列配置 columns.ts

在 `src/views/{module}/{page}/_components/columns.ts` 中生成表格列配置。

**规则**：

- 定义 `TableDataType` 类型，字段与接口返回字段对应
- 最后一列固定为 `action: null`（操作列）
- 关键标识列设置 `fixed: 'left'`
- 操作列设置 `fixed: 'right'`
- 长文本列设置 `ellipsis: true`
- 每列设置合理的 `width`

**模板**：

```typescript
import type { TableColumnType } from 'ant-design-vue';

type TableDataType = {
  id: string;
  // 根据接口文档字段填充，字段名与后端返回保持一致
  action: null;
};

export const columns: TableColumnType<TableDataType>[] = [
  { title: 'ID', dataIndex: 'id', width: 80, fixed: 'left' },
  // 根据接口文档字段动态生成列配置
  { title: '操作', dataIndex: 'action', width: 150, fixed: 'right' },
];
```

### Step 4: 生成新建/编辑弹窗 FormModel.vue（条件生成）

> **生成条件**：只有当页面满足以下任一条件时才生成 FormModel.vue，否则跳过此步：
>
> - 页面工具栏有「新建」按钮
> - 操作列有「编辑」功能
>
> 如果两者都没有（例如纯展示列表页、只读详情页），则跳过此步，同时 Step 5 中也无需引入 FormModel 组件和 `formModelRef`。

在 `src/views/{module}/{page}/_components/FormModel.vue` 中生成弹窗表单组件。

**关键模式**：

- 使用 `useFormModel` hook 处理表单状态（visible、formStatus、confirmLoading、title 等）
- `formStatus`：0 = 新建，1 = 编辑
- 通过 `defineExpose({ open, close })` 暴露方法给父组件调用
- 编辑时通过 `Object.assign(form, ...)` 回填表单数据
- 表单验证规则使用 `rules: Record<string, Rule[]>`

**模板**：

```vue
<template>
  <a-modal
    :title="title"
    :open="visible"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    :keyboard="false"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-form ref="ruleFormRef" :rules="rules" :model="form" :colon="false" v-bind="formItemLayout">
      <!-- 根据接口文档字段动态生成表单项 -->
      <a-form-item label="名称" name="name">
        <a-input v-model:value="form.name" placeholder="请输入名称" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
  import type { Rule } from 'ant-design-vue/es/form';

  const form = reactive({
    id: undefined,
    // 根据接口文档字段初始化表单字段
  });
  let visible = ref<boolean>(false);
  const emit = defineEmits(['submit']);
  const { ruleFormRef, formStatus, title, confirmLoading, formItemLayout, handleSubmit, handleCancel } = useFormModel(
    visible,
    form,
    emit,
  );
  const rules: Record<string, Rule[]> = {
    // 根据接口文档必填字段生成验证规则
  };

  /**
   * 父组件调用并传值给 formModel
   * */
  const open = (type, info?) => {
    visible.value = true;
    formStatus.value = type;
    if (type === 1 && info) {
      // 编辑模式：回填数据
      const {
        /* 解构需要回填的字段 */
      } = info;
      Object.assign(form, {
        /* 回填字段 */
      });
    }
  };
  const close = () => handleCancel();

  defineExpose({ open, close });
</script>
```

**表单组件映射规则**：

| 字段类型  | 推荐组件                       | 示例               |
| --------- | ------------------------------ | ------------------ |
| 短文本    | `a-input`                      | 名称、编码         |
| 长文本    | `a-textarea`                   | 描述、备注         |
| 数字      | `a-input-number`               | 排序号、数量       |
| 布尔/开关 | `a-switch`                     | 是否启用、是否显示 |
| 单选枚举  | `a-radio-group` + `a-radio`    | 状态（启用/禁用）  |
| 下拉选择  | `a-select` + `a-select-option` | 类型、分类         |
| 日期      | `a-date-picker`                | 日期               |
| 密码      | `a-input-password`             | 密码               |

### Step 5: 生成列表页面 index.vue

在 `src/views/{module}/{page}/index.vue` 中生成列表页面。

**关键模式**：

- 使用 `useCurd` hook 统一管理列表的增删改查逻辑
- `query` 对象传递固定查询参数
- `curdMethod` 对象映射 4 个接口方法（fetch、add、edit、del）
- 表格使用 `a-table`，通过 `#bodyCell` 插槽处理操作列和特殊列渲染
- 删除使用 `showDelTableFormDialog` 方法（已封装确认弹窗）
- 注意：`contextHolder` 必须在模板中渲染（删除确认弹窗依赖）

**条件分支**：

- 有新建/编辑功能时：引入 FormModel 组件，解构 `formModelRef`，工具栏含新建按钮，操作列含编辑
- 无新建/编辑功能时：不引入 FormModel 组件，不解构 `formModelRef`，工具栏无新建按钮，操作列无编辑

**不分页场景模板**（如树形列表）：

```vue
<template>
  <div class="table-toolbar">
    <a-button type="primary" @click="formModelRef.open(0)"> 新建 </a-button>
    <a-input style="width: 250px" v-model:value="fuzzyContent" placeholder="请输入名称或编码" />
  </div>

  <a-table
    ref="table"
    rowKey="id"
    size="middle"
    :dataSource="data"
    :columns="columns"
    :loading="loading"
    :pagination="false"
    @change="handlePageChange"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'action'">
        <a @click="formModelRef.open(1, record)">编辑</a>
        <a-divider type="vertical" />
        <a @click.prevent="showDelTableFormDialog(record.id)">删除</a>
      </template>
    </template>
  </a-table>

  <FormModel ref="formModelRef" @submit="submitMethod" />
  <!-- Modal.useModal 上下文占位：模板根节点渲染一次，禁止放在 #bodyCell 内 -->
  <contextHolder />
</template>

<script lang="ts" setup>
  import FormModel from './_components/FormModel.vue';
  import { columns } from './_components/columns';
  import { getXxxList, createXxx, updateXxx, deleteXxxById } from '@/api/moduleName';

  const query = reactive({});
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
    contextHolder,
    showDelTableFormDialog,
    submitMethod,
    handlePageChange,
  } = useCurd(curdMethod, query, { immediate: true, hasPagination: false });
</script>
```

**分页场景模板**（标准列表）：

```vue
<template>
  <div class="table-toolbar">
    <a-button type="primary" @click="formModelRef.open(0)"> 新建 </a-button>
    <a-input style="width: 250px" v-model:value="fuzzyContent" placeholder="请输入名称或编码" />
  </div>

  <a-table
    ref="table"
    rowKey="id"
    size="middle"
    :dataSource="data"
    :columns="columns"
    :loading="loading"
    :pagination="pagination"
    @change="handlePageChange"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'action'">
        <a @click="formModelRef.open(1, record)">编辑</a>
        <a-divider type="vertical" />
        <a @click.prevent="showDelTableFormDialog(record.id)">删除</a>
      </template>
    </template>
  </a-table>

  <FormModel ref="formModelRef" @submit="submitMethod" />
  <!-- Modal.useModal 上下文占位：模板根节点渲染一次，禁止放在 #bodyCell 内 -->
  <contextHolder />
</template>

<script lang="ts" setup>
  import FormModel from './_components/FormModel.vue';
  import { columns } from './_components/columns';
  import { getXxxList, createXxx, updateXxx, deleteXxxById } from '@/api/moduleName';

  const query = reactive({});
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
    contextHolder,
    showDelTableFormDialog,
    submitMethod,
    handlePageChange,
  } = useCurd(curdMethod, query);
</script>
```

**无新建/编辑功能的只读列表模板**：

```vue
<template>
  <div class="table-toolbar">
    <a-input style="width: 250px" v-model:value="fuzzyContent" placeholder="请输入名称或编码" />
  </div>

  <a-table
    ref="table"
    rowKey="id"
    size="middle"
    :dataSource="data"
    :columns="columns"
    :loading="loading"
    :pagination="pagination"
    @change="handlePageChange"
  >
    <template #bodyCell="{ column, record }">
      <!-- 仅保留特殊列渲染，无操作列或仅删除 -->
      <template v-if="column.dataIndex === 'action'">
        <a @click.prevent="showDelTableFormDialog(record.id)">删除</a>
      </template>
    </template>
  </a-table>

  <contextHolder />
</template>

<script lang="ts" setup>
  import { columns } from './_components/columns';
  import { getXxxList, deleteXxxById } from '@/api/moduleName';

  const query = reactive({});
  const curdMethod = {
    fetch: getXxxList,
    del: deleteXxxById,
  };

  const { fuzzyContent, data, loading, pagination, contextHolder, showDelTableFormDialog, handlePageChange } = useCurd(
    curdMethod,
    query,
  );
</script>
```

### Step 6: 根据接口文档刷新字段

当用户提供接口文档或要求刷新字段时：

1. **读取接口文档**：使用 Apifox MCP 工具读取最新的接口文档（调用 `mcp-apifox` skill）
2. **更新 columns.ts**：根据接口返回字段更新 `TableDataType` 和 `columns` 配置
3. **更新 FormModel.vue**：根据接口请求参数更新 `form` 响应式对象、`rules` 验证规则、表单模板
4. **更新 API 类型定义**：根据接口文档更新 `src/api/` 中的类型定义和请求函数
5. **更新 index.vue**：如有新增查询参数，更新 `query` 对象

**字段刷新原则**：

- 字段名与后端接口返回保持一致（驼峰命名）
- 忽略前端不需要展示的字段（如内部状态标记）
- `id`、`createdTime`、`updatedTime` 等通用字段视需求保留
- 枚举类型字段在 `FormModel` 中使用下拉选择组件
- 布尔类型字段在 `FormModel` 中使用开关组件

## 关键约束

1. **自动导入**：禁止手动 import Vue API（ref、reactive、computed 等）、Ant Design Vue 组件、项目 hooks（useCurd、useFormModel、useTable 等）
2. **手动 import**：必须手动 import 的内容：
   - `FormModel` 组件：`import FormModel from './_components/FormModel.vue'`
   - `columns` 配置：`import { columns } from './_components/columns'`
   - API 函数：`import { getXxxList, ... } from '@/api/moduleName'`
   - 类型：`import type { Rule } from 'ant-design-vue/es/form'`、`import type { TableColumnType } from 'ant-design-vue'`
3. **useCurd 参数**：第二个参数 `params` 必须是 `reactive` 对象
4. **contextHolder**：使用 `showDelTableFormDialog` 时，模板中必须渲染 `<contextHolder />`
5. **ESLint 规范**：单行属性不超过 5 个，超过则多行每行 1 个
6. **样式规范**：表格工具栏使用 `.table-toolbar` 类名

## 特殊场景处理

### 树形表格

树形数据不分页，`pagination` 设为 `false`，按需设置 `:scroll="{ y: xxx }"` 固定表头（项目暂无滚动高度自动计算工具，勿引用不存在的 API）：

```vue
<a-table :pagination="false" ... />
```

`useCurd` 第三个参数传 `{ hasPagination: false }`，此时 `fetch` 直接收到 `query` 参数对象（不包装 `pageNo/size`）。

### 多条目表单查询

上方使用 `a-form` 布局查询表单，结合 `useForm` hook：

```vue
<div class="table-flex-form">
  <a-form :layout="'inline'">
    <a-form-item label="名称">
      <a-input v-model:value="queryForm.name" placeholder="请输入" />
    </a-form-item>
    <a-form-item>
      <a-button type="primary" @click="handleSearch">查询</a-button>
      <a-button @click="handleReset" style="margin-left: 12px">重置</a-button>
    </a-form-item>
  </a-form>
</div>
```

### 操作列扩展

在 `#bodyCell` 插槽中添加更多操作按钮：

```vue
<template v-if="column.dataIndex === 'action'">
  <a @click="formModelRef.open(1, record)">编辑</a>
  <a-divider type="vertical" />
  <a @click="handleDetail(record)">详情</a>
  <a-divider type="vertical" />
  <a @click.prevent="showDelTableFormDialog(record.id)">删除</a>
  <contextHolder />
</template>
```

### 自定义列渲染

对特殊列使用 `v-else-if` 分支：

```vue
<template v-else-if="column.dataIndex === 'status'">
  <a-tag :color="record.status === 1 ? 'green' : 'red'">
    {{ record.status === 1 ? '启用' : '禁用' }}
  </a-tag>
</template>
```

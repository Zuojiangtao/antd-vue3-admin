# 项目概述

这是一个基于 Vue 3 + TypeScript + Vite 构建的前端管理后台脚手架，集成了 Ant Design Vue UI 组件库、Pinia 状态管理、Vue Router 路由，以及丰富的工程化构建配置（自动导入、CDN 外部化、gzip/brotli 压缩、图片优化、打包分析等）。

> 当前状态：项目处于脚手架初期阶段。`src/views`、`src/components` 中仍保留 create-vue 生成的模板文件（`HelloWorld.vue`、`HomeView.vue`、`AboutView.vue` 等），业务模块尚未开发，开发时按项目规范逐步替换。

## 技术栈

- **核心框架**: Vue 3.5 (Composition API)
- **开发语言**: TypeScript 5.7
- **构建工具**: Vite 7.2
- **UI 组件库**: Ant Design Vue 4.2
- **状态管理**: Pinia 3.0 + pinia-plugin-persistedstate
- **路由管理**: Vue Router 4.6
- **HTTP 客户端**: Axios 1.13
- **工具库**: VueUse 14.1、dayjs
- **样式预处理**: Less 4.4
- **代码质量**: ESLint 8.57 + Prettier 3.0
- **包管理器**: pnpm

## 项目特性

- 🚀 **现代化开发体验**: 基于 Vite 的极速热更新和构建
- 📦 **自动导入**: 使用 unplugin-auto-import 和 unplugin-vue-components 自动导入 Vue、Pinia、Vue Router、VueUse、axios 及项目 hooks、公共组件（详见自动导入规则）
- 🎨 **SVG 图标**: 通过 vite-svg-loader 支持 SVG 按组件方式使用（`src/components/icons/`）
- 🔒 **权限体系预留**: 路由表区分 `constantRouterMap`/`asyncRouterMap`，stores 中已含 permission、keep-alive、multi-tab 模块
- 📊 **构建优化**: 代码压缩（gzip/brotli）、CDN 外部化（vite-plugin-external-cdn）、HTML 模板注入、图片自动优化、打包分析报告（rollup-plugin-visualizer）
- 🔧 **开发工具**: 集成 commitlint、husky、lint-staged 规范化 Git 工作流
- 🌍 **多环境**: 支持 development / sit / uat / production 多模式构建

# 项目结构

```
├── build/                    # 构建配置模块
│   ├── index.ts             # Vite 插件统一装配入口
│   ├── proxy.ts             # 开发服务器代理配置
│   ├── utils.ts             # 构建工具函数（环境变量转换等）
│   ├── loader/              # 自定义 loader (svgComponent)
│   └── plugin/              # Vite 插件配置
│       ├── autoImport.ts    # unplugin-auto-import
│       ├── components.ts    # unplugin-vue-components
│       ├── html.ts          # vite-plugin-html（标题注入等）
│       ├── cdnImport.ts     # vite-plugin-external-cdn（生产 CDN 外部化）
│       ├── compression.ts   # vite-plugin-compression（gzip/brotli）
│       ├── imageOptimize.ts # vite-plugin-image-optimizer
│       └── visualizer.ts    # rollup-plugin-visualizer（分析报告）
├── deploy/                  # 部署配置（nginx conf）
├── public/                  # 静态公共资源（favicon）
├── src/
│   ├── assets/              # 静态资源 (图片、图标、字体等，统一放此处)
│   ├── components/          # 全局公共组件（自动导入，无需手动注册）
│   │   ├── Exception/       # 异常页面组件 (404、403、500 等)
│   │   └── icons/           # SVG 图标组件
│   ├── hooks/               # 自定义 Composition API hooks（自动导入）
│   │   ├── useCurd.ts       # 增删改查通用逻辑
│   │   ├── useDeepClone.ts  # 深拷贝工具
│   │   ├── useEcharts.ts    # ECharts 图表封装
│   │   ├── useForm.ts       # 表单处理
│   │   ├── useFormModel.ts  # 表单模型管理
│   │   └── useTable.ts      # 表格处理
│   ├── layouts/             # 布局组件
│   │   ├── Layout.vue       # 主布局组件
│   │   ├── header/          # 顶部导航 (GlobalHeader.tsx)
│   │   ├── menu/            # 侧边菜单 (SiderMenu.tsx)
│   │   ├── multiTab/        # 多标签页 (MultiTab.tsx)
│   │   ├── sider/           # 侧边栏 (LayoutSider.vue)
│   │   └── typings.ts       # 布局类型定义
│   ├── router/              # 路由配置
│   │   ├── constant.ts      # 路由常量
│   │   ├── index.ts         # 路由主入口
│   │   ├── routes.ts        # 路由表（constant/async/complete/basic 路由映射）
│   │   └── module/          # 模块化路由（按业务模块拆分）
│   │       └── home.ts      # 首页路由（redirect 到 /dashboard）
│   ├── stores/              # Pinia 状态管理
│   │   ├── index.ts         # Store 统一导出入口
│   │   ├── app.ts           # 应用全局状态
│   │   ├── counter.ts       # 计数器示例（脚手架模板，可移除）
│   │   ├── keep-alive.ts    # 页面缓存状态
│   │   ├── multi-tab.ts     # 多标签页状态
│   │   └── permission.ts    # 权限状态
│   ├── utils/               # 工具函数库
│   │   ├── request.ts       # Axios 请求封装 (拦截器、错误处理)
│   │   ├── axios.ts         # Axios 实例配置
│   │   └── download.ts      # 文件下载工具
│   ├── views/               # 页面视图组件
│   │   ├── home.vue         # 首页
│   │   └── ...              # 其余为 create-vue 模板文件（待替换）
│   ├── App.vue              # 应用根组件
│   └── main.ts              # 应用入口文件（当前为最简初始化：Pinia + Router）
└── types/                   # 全局类型声明
    ├── auto-imports.d.ts    # 自动导入 API 类型声明（生成文件，勿手动修改）
    └── components.d.ts      # 自动导入组件类型声明（生成文件，勿手动修改）
```

# 构建配置

Vite 主配置位于根目录 `vite.config.ts`，插件与代理等扩展配置在 `build/` 目录下模块化管理：

- 路径别名：`@` → `src/`，`#` → `types/`
- 生产环境按环境变量条件启用：CDN 外部化（`VITE_USE_CDN`）、压缩（`VITE_BUILD_COMPRESS`）、图片优化（`VITE_USE_IMAGEMIN`）
- `REPORT=true pnpm report` 生成打包分析报告

# 开发指南

## 环境变量

项目支持多环境配置：

- `.env` - 基础环境变量
- `.env.development` - 开发环境
- `.env.sit` / `.env.uat` - 测试环境
- `.env.production` - 生产环境

关键环境变量：

| 变量 | 说明 |
|------|------|
| `VITE_PORT` | 开发服务器端口 |
| `VITE_PROXY` | API 代理配置（JSON 数组，支持多后端代理） |
| `VITE_GLOB_API_URL` | 本地接口地址代理路径 |
| `VITE_GLOB_API_URL_PREFIX` | 接口地址前缀（生产直连地址） |
| `VITE_GLOB_APP_TITLE` | 应用标题（注入 HTML 模板） |
| `VITE_USE_MOCK` | 是否开启 mock |
| `VITE_USE_CDN` | 生产构建是否启用 CDN 外部化 |
| `VITE_BUILD_COMPRESS` | 压缩格式：gzip / brotli / gzip\|brotli / none |
| `VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE` | 压缩后是否删除源文件 |
| `VITE_USE_IMAGEMIN` | 生产构建是否压缩图片 |
| `VITE_DROP_CONSOLE` | 是否移除 console 及 debugger |

## 脚本命令

```bash
pnpm dev              # 启动开发服务器
pnpm build            # 生产构建
pnpm build:dev        # development 模式构建
pnpm build:sit        # sit 模式构建
pnpm build:uat        # uat 模式构建
pnpm build-only       # 仅 vite build（各模式构建的底层命令）
pnpm preview          # 预览生产构建（端口 4173）
pnpm report           # 生成构建分析报告
pnpm type-check       # vue-tsc 类型检查
pnpm lint             # ESLint 检查并修复
pnpm format           # Prettier 格式化 src/
pnpm clean:cache      # 清理 node_modules 缓存
pnpm clean:lib        # 删除 node_modules
```

## 代码规范

### ESLint 配置

- 配置文件: `.eslintrc.js`
- 集成规则: Vue 3、TypeScript、Prettier
- 自动修复: `pnpm lint` 命令

### Prettier 配置

- 配置文件: `.prettierrc`
- 代码格式化: `pnpm format` 命令

### Git 工作流

- **Commitlint**: 使用 Conventional Commits 规范（`commitlint.config.cjs`）
- **Husky**: Git hooks 自动化
- **Lint-staged**: 暂存区代码检查

### 文件命名规范

- Vue 组件: `PascalCase.vue`
- TypeScript 文件: `camelCase.ts`
- 目录: `kebab-case/`

## 路由配置

路由采用模块化设计（`src/router/`）：

- `routes.ts` 导出 `constantRouterMap`（异常页等基础路由）、`asyncRouterMap`（业务路由）、`completeRouterMap`、`basicRoutes`
- 业务路由在 `src/router/module/` 下按模块拆分，目前仅有 `home.ts`
- 页面组件懒加载，`/` 根路由使用 `Layout.vue` 作为布局组件，redirect 到 `/dashboard`
- 新增业务模块时在 `module/` 下新建路由文件并合入 `asyncRouterMap`

## 状态管理

使用 Pinia 作为全局状态管理方案：

- Store 定义在 `src/stores/`，`index.ts` 统一导出
- 集成 pinia-plugin-persistedstate 实现状态持久化
- 已有模块：app（全局设置）、permission（权限）、keep-alive（页面缓存）、multi-tab（多标签页）

## API 请求

统一的 HTTP 请求封装（`src/utils/request.ts`、`src/utils/axios.ts`）：

- 统一拦截器与错误处理
- 接口地址由 `VITE_GLOB_API_URL` / `VITE_GLOB_API_URL_PREFIX` 控制
- 多后端代理通过 `.env` 中的 `VITE_PROXY` 数组配置
- 新增接口模块时建议创建 `src/api/` 目录按模块组织

# 项目记忆

本项目采用「AGENTS.md + 按需规则 + Skills + 工具强制」的分层规范体系，本文件是项目信息的单一事实来源。

**规则（`.codebuddy/rules/`，按需加载）**

- **编码规范指南** (coding_standards.mdc) — 文件命名、目录组织、资源文件管理
- **自动导入规范** (type_components_import.mdc) — 禁止手动 import 的 API/组件白名单（alwaysApply）
- **Vue 3 组件开发指南** (vue3.mdc) — Composition API 最佳实践、组件结构规范
- **Ant Design Vue 最佳实践** (ant-design-vue.mdc) — 组件使用规范、样式定制指南
- **Vite 最佳实践** (vite.mdc) — 配置优化、性能调优
- **TypeScript 规范** (typescript.mdc) — 类型安全最佳实践

**Skills（`.codebuddy/skills/`，任务触发时加载）**

- **curd** — 列表页 CRUD 全链路开发工作流（开发列表页、表单弹窗、对接接口时使用）
- **code-review** — 代码审查工作流（审查/review 代码时使用）

**工具强制（优先级最高，不依赖 AI 自觉）**

- ESLint `no-restricted-imports`（`.eslintrc.js` overrides）强制 `src/views/**` 的自动导入规范
- ESLint + Prettier + commitlint + lint-staged（husky）强制代码风格与提交规范
- `pnpm lint` 与 `pnpm type-check` 必须通过

# 快速开始

1. **环境准备**: Node.js 18+、pnpm 8+
2. **安装依赖**: `pnpm install`
3. **启动开发**: `pnpm dev`
4. **构建部署**: `pnpm build`

# 注意事项

1. **资源文件位置**: 所有静态资源必须放在 `src/assets/` 目录下，禁止在根目录创建 assets 文件夹
2. **自动导入**: Vue/Pinia/VueRouter/VueUse/axios/项目 hooks/公共组件均已自动导入，禁止手动 import（详见工作区自动导入规则；`src/views/**` 已由 ESLint `no-restricted-imports` 强制拦截）
3. **生成文件勿改**: `types/auto-imports.d.ts`、`types/components.d.ts` 由插件生成
4. **API 代理**: 多后端服务时，需要在 `.env` 文件中配置 `VITE_PROXY` 数组和对应的环境变量
5. **模板遗留文件**: `HelloWorld.vue`、`TheWelcome.vue`、`WelcomeItem.vue`、`HomeView.vue`、`AboutView.vue`、`counter.ts` 等为脚手架模板文件，开发对应功能时应替换而非沿用

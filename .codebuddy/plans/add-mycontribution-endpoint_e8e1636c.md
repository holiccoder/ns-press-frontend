---
name: add-mycontribution-endpoint
overview: 为 dashboard 增加一个认证的 myContribution 接口，并准备在首个表格使用它。
todos:
  - id: scan-similar-apis
    content: 使用 [subagent:code-explorer] 复核相似接口返回结构与字段命名
    status: completed
  - id: add-api-endpoint
    content: 在 src/services/api.js 的 submissionAPI 中新增 getMyContribution 接口
    status: completed
    dependencies:
      - scan-similar-apis
  - id: dashboard-data-render
    content: 在 src/pages/DashboardPage.jsx 请求数据并渲染到“我的投稿”表格
    status: completed
    dependencies:
      - add-api-endpoint
  - id: edge-handling
    content: 完善空状态与错误处理，保证无数据时仍显示提示行
    status: completed
    dependencies:
      - dashboard-data-render
---

## User Requirements

- 新增一个经过认证的 GET 接口：`/api/index/myContribution`
- 将该接口接入现有前端 API 模块（submission 相关）
- 在 Dashboard 首个表格中展示该接口返回的投稿数据

## Product Overview

- 在用户仪表盘的“我的投稿”表格中显示登录用户的投稿记录列表

## Core Features

- 通过已登录的认证头请求投稿列表
- 在“我的投稿”表格中渲染列表数据或空状态提示

## Tech Stack Selection

- 前端：React（Vite）+ JavaScript
- UI：Ant Design（已在页面中使用）
- 样式：Less
- 网络请求：Axios（`src/services/api.js` 统一封装）

## Implementation Approach

- 在 `submissionAPI` 中新增 `getMyContribution` 方法，使用现有 `apiClient` 拦截器自动注入认证头。
- 在 `DashboardPage.jsx` 中新增数据请求与状态管理，组件挂载时获取数据并渲染到“我的投稿”表格。
- 为未知返回字段做安全兼容：优先使用接口字段映射，缺失时显示占位符，保持表格结构稳定。
- 性能：仅在页面加载时请求一次，渲染复杂度 O(n)；避免重复请求与多次渲染。

## Implementation Notes

- 复用 `apiClient` 认证逻辑，避免新增 token 处理分支。
- 出错时保持空表格提示，避免 UI 崩溃；必要时复用 antd `message` 提示（遵循现有用法）。
- 不改动现有导航与样式结构，控制影响范围。

## Architecture Design

- 现有结构保持：页面层（DashboardPage）→ 服务层（submissionAPI）→ axios 客户端
- 数据流：页面挂载 → 调用 `submissionAPI.getMyContribution()` → 更新列表状态 → 表格渲染

## Directory Structure Summary

```
d:/projects/hk-natural-press/hk-natural-press/
├── src/
│   ├── services/
│   │   └── api.js  # [MODIFY] 在 submissionAPI 中新增 myContribution 的 GET 接口封装
│   └── pages/
│       └── DashboardPage.jsx  # [MODIFY] 请求投稿列表并渲染到首个表格
```

## Agent Extensions

### SubAgent

- **code-explorer**
- Purpose: 进一步核对项目内相似接口的返回字段与使用模式
- Expected outcome: 确认表格字段映射策略与空状态处理方式
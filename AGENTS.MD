## 代码结构


```
llmops-admin/
├── public/              # 静态 HTML 模板、favicon
├── mock/                # Mock API 服务
├── src/
│   ├── api/             # API 请求封装
│   ├── assets/          # 图片资源
│   ├── components/      # 通用组件
│   ├── icons/           # SVG 图标系统
│   ├── layout/          # 后台主布局
│   ├── router/          # 路由配置
│   ├── store/           # Vuex 状态管理
│   ├── styles/          # 全局 SCSS 样式
│   ├── utils/           # 工具函数、请求封装、鉴权
│   ├── views/           # 页面级组件
│   ├── App.vue          # 根组件
│   ├── main.js          # 应用入口
│   └── permission.js    # 路由权限守卫
├── tests/               # Jest 单元测试
├── vue.config.js        # Vue CLI / Webpack 配置
└── package.json         # 依赖与脚本

```

## 入口链路
```
public/index.html
  -> src/main.js
    -> App.vue
      -> router-view
        -> Layout
          -> Sidebar / Navbar / AppMain
            -> views/*

```

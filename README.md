# Wujie 微前端示例：jQuery 父应用 + React 子应用

这个项目演示了如何使用 Wujie 微前端框架实现一个 jQuery 父应用加载 React 子应用，使用 Shadow DOM 模式并实现父子应用之间的通信。

## 项目结构

```
wujie-jQuery-React/
├── jQuery/                 # jQuery 父应用
│   ├── index.html         # 父应用 HTML 文件
│   └── app.js             # 父应用 JavaScript 文件
└── React/                 # React 子应用
    ├── package.json       # 子应用依赖配置
    ├── rsbuild.config.ts  # Rsbuild 配置
    ├── tsconfig.json      # TypeScript 配置
    ├── public/
    │   └── index.html     # 子应用 HTML 模板
    └── src/
        ├── index.tsx      # 子应用入口文件
        ├── App.tsx        # 子应用主组件
        ├── index.css      # 子应用样式
        └── types.d.ts     # Wujie 类型定义
```

## 运行步骤

### 方式一：使用启动脚本（推荐）

使用项目根目录下的启动脚本，可以同时启动两个应用：

```bash
node start.js
```

这将按顺序启动React子应用和jQuery父应用。

### 方式二：分别启动

#### 1. 启动 React 子应用

首先，进入 React 子应用目录，安装依赖并启动开发服务器：

```bash
cd React
npm install
npm run dev
```

子应用将在 `http://localhost:3000` 上运行。

### 2. 运行 jQuery 父应用

有两种方式运行 jQuery 父应用：

#### 方式一：使用 Node.js 服务器（推荐）

进入 jQuery 父应用目录，使用 Node.js 启动服务器：

```bash
cd jQuery
node server.js
```

父应用将在 `http://localhost:3001` 上运行。

#### 方式二：直接在浏览器中打开

直接在浏览器中打开 `jQuery/index.html` 文件。

### 3. 测试微前端功能

1. 在父应用中点击"启动子应用"按钮，加载 React 子应用
2. 在父应用中输入消息并点击"发送消息给子应用"，查看子应用是否收到消息
3. 在子应用中输入消息并点击"发送消息给父应用"，查看父应用是否收到消息
4. 点击"停止子应用"按钮，卸载子应用

## 技术实现

### 父应用 (jQuery)

- 使用 CDN 引入 jQuery 和 Wujie 库
- 配置 Wujie 使用 Shadow DOM 模式加载子应用
- 通过 `window.$wujie.bus` 实现与子应用的通信

### 子应用 (React)

- 使用 Rsbuild 构建的 React TypeScript 应用
- 实现了 Wujie 子应用的生命周期函数
- 通过 `window.$wujie.bus` 监听和发送消息

### 通信机制

父子应用之间的通信通过 Wujie 提供的事件总线实现：

- 父应用发送消息：`window.$wujie.bus.$emit('message-from-parent-app', data)`
- 子应用监听消息：`window.$wujie.bus.$on('message-from-parent-app', callback)`
- 子应用发送消息：`window.$wujie.bus.$emit('message-from-sub-app', data)`
- 父应用监听消息：`window.$wujie.bus.$on('message-from-sub-app', callback)`

## 注意事项

1. 确保子应用先于父应用启动，或者父应用中处理子应用未加载的情况
2. Shadow DOM 模式下，子应用的样式不会影响父应用，反之亦然
3. 在生产环境中，建议使用特定版本的 Wujie 库而非 CDN 链接

## 扩展功能

这个示例可以进一步扩展以实现：

1. 多个子应用的加载和管理
2. 更复杂的数据共享机制
3. 子应用路由管理
4. 子应用之间的直接通信
5. 应用状态同步

## 参考资料

- [Wujie 官方文档](https://wujie-micro.github.io/doc/)
- [Rsbuild 文档](https://rsbuild.dev/)
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  output: {
    // 设置资源前缀，确保在微前端环境中能正确加载
    assetPrefix: 'http://localhost:3000',
    // 设置输出目录
    distPath: {
      root: 'dist',
    },
    // 设置文件名格式
    filename: {
      js: '[name].[contenthash:8].js',
      css: '[name].[contenthash:8].css',
    },
  },
  source: {
    // 设置入口文件
    entry: {
      index: './src/index.tsx',
    },
    // 设置别名
    alias: {
      '@': './src',
    },
  },
  // 添加微前端相关配置
  performance: {
    // 移除 console.log，方便调试
    removeConsole: false,
  },
  // 添加跨域配置
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    },
  },
  // 添加 HTML 配置
  html: {
    // 设置模板
    template: './public/index.html',
    // 设置标题
    title: 'React 子应用',
  },
});
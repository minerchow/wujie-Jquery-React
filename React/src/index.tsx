import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Page1 from './Page1';
import Page2 from './Page2';
import './index.css';

// 检测是否在 Wujie 环境中运行
const isWujieEnvironment = window.__POWERED_BY_WUJIE__;

// 子应用生命周期函数
if (isWujieEnvironment) {
  // 子应用加载时
  window.__WUJIE_MOUNT = () => {
    console.log('React 子应用挂载');
    const rootElement = document.getElementById('root');
    if (rootElement) {
      const root = ReactDOM.createRoot(rootElement);
      root.render(
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/page1" element={<Page1 />} />
            <Route path="/page2" element={<Page2 />} />
          </Routes>
        </BrowserRouter>
      );
    }
  };
  
  // 子应用卸载时
  window.__WUJIE_UNMOUNT = () => {
    console.log('React 子应用卸载');
    const rootElement = document.getElementById('root');
    if (rootElement) {
      // React 18 使用 createRoot，需要通过 root.unmount() 来卸载
      const root = (rootElement as any)._reactRootContainer;
      if (root && root.unmount) {
        root.unmount();
      }
    }
  };
} else {
  // 非微前端环境，直接渲染
  const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
  root.render(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/page1" element={<Page1 />} />
        <Route path="/page2" element={<Page2 />} />
      </Routes>
    </BrowserRouter>
  );
}

// 导出生命周期函数，确保wujie可以访问
export const bootstrap = async () => {
  console.log('React 子应用 bootstrap');
};

export const mount = async () => {
  console.log('React 子应用 mount');
  if (window.__WUJIE_MOUNT) {
    window.__WUJIE_MOUNT();
  }
};

export const unmount = async () => {
  console.log('React 子应用 unmount');
  if (window.__WUJIE_UNMOUNT) {
    window.__WUJIE_UNMOUNT();
  }
};
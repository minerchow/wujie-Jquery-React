#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

// 启动React子应用
console.log('正在启动React子应用...');
const reactApp = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'React'),
  shell: true
});

reactApp.stdout.on('data', (data) => {
  console.log(`[React] ${data.toString().trim()}`);
});

reactApp.stderr.on('data', (data) => {
  console.error(`[React Error] ${data.toString().trim()}`);
});

// 等待一段时间后启动jQuery父应用
setTimeout(() => {
  console.log('\n正在启动jQuery父应用...');
  const jQueryApp = spawn('node', ['server.js'], {
    cwd: path.join(__dirname, 'jQuery'),
    shell: true
  });

  jQueryApp.stdout.on('data', (data) => {
    console.log(`[jQuery] ${data.toString().trim()}`);
  });

  jQueryApp.stderr.on('data', (data) => {
    console.error(`[jQuery Error] ${data.toString().trim()}`);
  });

  // 优雅关闭
  process.on('SIGINT', () => {
    console.log('\n正在关闭所有应用...');
    reactApp.kill('SIGINT');
    jQueryApp.kill('SIGINT');
    process.exit(0);
  });
}, 3000); // 等待3秒，确保React应用先启动

console.log('请等待应用启动完成...');
console.log('React子应用将在 http://localhost:3000 运行');
console.log('jQuery父应用将在 http://localhost:3001 运行');
console.log('按 Ctrl+C 退出所有应用');
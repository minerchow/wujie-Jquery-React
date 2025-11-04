const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3001;
const publicDir = __dirname;

// MIME类型映射
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  
  // 处理根路径请求
  let filePath = req.url === '/' ? '/index.html' : req.url;
  filePath = path.join(publicDir, filePath);
  
  // 获取文件扩展名
  const extname = String(path.extname(filePath)).toLowerCase();
  const mimeType = mimeTypes[extname] || 'application/octet-stream';
  
  // 读取文件
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        // 文件不存在
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<html><body><h1>404 Not Found</h1><p>The requested resource was not found on this server.</p></body></html>', 'utf-8');
      } else {
        // 服务器错误
        res.writeHead(500);
        res.end(`Server Error: ${error.code}`, 'utf-8');
      }
    } else {
      // 成功返回文件
      res.writeHead(200, { 
        'Content-Type': mimeType,
        'Access-Control-Allow-Origin': '*', // 允许跨域，方便微前端通信
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(port, () => {
  console.log(`jQuery 父应用服务器运行在 http://localhost:${port}`);
  console.log(`请在浏览器中访问 http://localhost:${port} 查看应用`);
});

// 优雅关闭
process.on('SIGINT', () => {
  console.log('\n正在关闭服务器...');
  server.close(() => {
    console.log('服务器已关闭');
    process.exit(0);
  });
});
$(document).ready(function() {
    // 初始化 wujie 微前端配置
    let subAppInstance = null;
    window.Wujie = window.wujie;
    
    // 初始化应用
    function initApp() {
        console.log('初始化 Page2 应用...');
        console.log("window",window)
        // 延迟检查 wujie 是否已加载，给脚本加载留出时间
        setTimeout(() => {
            // 检查 wujie 是否已加载
            if (typeof window.Wujie === 'undefined') {
                console.error('Wujie 未加载，请检查脚本是否正确引入');
                $('#status').text('Wujie 未加载');
                return;
            }
            
            console.log('Wujie 已加载，版本:', window.Wujie.version);
        
        // 初始化 wujie
        try {
            // 检查是否有init方法，如果没有，说明wujie已经自动初始化
            if (typeof window.wujie.init === 'function') {
                window.wujie.init({
                    // 设置子应用预加载
                    prefetch: true,
                    // 设置子应用缓存
                    cache: true,
                    // 设置子应用沙箱
                    sandbox: true,
                    // 设置子应用样式隔离
                    styleScope: true,
                    // 设置子应用路由模式
                    router: {
                        mode: 'history'
                    },
                    // 设置子应用生命周期钩子
                    beforeLoad: (appWindow) => {
                        console.log('子应用加载前:', appWindow);
                    },
                    afterLoad: (appWindow) => {
                        console.log('子应用加载后:', appWindow);
                    },
                    beforeMount: (appWindow) => {
                        console.log('子应用挂载前:', appWindow);
                    },
                    afterMount: (appWindow) => {
                        console.log('子应用挂载后:', appWindow);
                        // 设置通信
                        setupCommunication();
                    },
                    beforeUnmount: (appWindow) => {
                        console.log('子应用卸载前:', appWindow);
                    },
                    afterUnmount: (appWindow) => {
                        console.log('子应用卸载后:', appWindow);
                    }
                });
            } else {
                console.log('wujie 已自动初始化');
            }
            
            console.log('wujie 初始化成功');
            $('#status').text('Page2 应用已就绪');
            
            // 绑定事件
            bindEvents();
        } catch (error) {
            console.error('wujie 初始化失败:', error);
            $('#status').text('wujie 初始化失败: ' + error.message);
        }
        }, 1000); // 延迟1秒检查，确保脚本已加载
    }
    
    // 子应用配置
    const subAppConfig = {
        name: 'react-sub-app-page2',
        url: 'http://localhost:3000/page2', // React 子应用的 Page2 路由
        exec: true,
        // 传递给子应用的初始数据
        props: {
            parentAppName: 'jQuery 父应用 - Page2',
            initialMessage: '来自父应用 Page2 的问候',
            timestamp: new Date().toLocaleTimeString()
        },
        // 使用 Shadow DOM 模式
        shadow: true,
        // 子应用容器
        el: '#subAppContainer',
        // 添加路由配置
        route: {
            // 子应用路由前缀
            base: '/page2'
        },
        // 添加样式隔离配置
        style: {
            // 是否启用样式隔离
            isolate: true
        },
        // 生命周期钩子
        beforeLoad: (appWindow) => {
            console.log('子应用开始加载');
        },
        afterLoad: (appWindow) => {
            console.log('子应用加载完成');
        },
        beforeMount: (appWindow) => {
            console.log('子应用开始挂载');
        },
        afterMount: (appWindow) => {
            console.log('子应用挂载完成');
            // 子应用挂载完成后，设置通信
            setupCommunication();
            
            // 自动发送初始消息给子应用
            setTimeout(() => {
                if (window.Wujie && window.Wujie.bus) {
                    window.Wujie.bus.$emit('message-from-parent', {
                        message: '欢迎来到微前端世界！这是来自父应用 Page2 的自动消息。',
                        timestamp: new Date().toISOString()
                    });
                    console.log('已自动发送初始消息给子应用');
                    
                    // 更新状态
                    $('#status').text('子应用运行中，已发送初始消息');
                }
            }, 1000); // 延迟1秒发送，确保子应用已完全加载
        },
        beforeUnmount: (appWindow) => {
            console.log('子应用开始卸载');
        },
        afterUnmount: (appWindow) => {
            console.log('子应用卸载完成');
        },
        // 错误处理
        onerror: (e) => {
            console.error('子应用加载错误:', e);
            $('#status').text('子应用加载错误: ' + e.message);
        }
    };
    
    // 启动子应用函数
    function startSubApp() {
        console.log('启动子应用...');
        
        if (!window.Wujie) {
            console.error('Wujie 未加载');
            $('#status').text('Wujie 未加载');
            return;
        }
        
        try {
            // 清空容器
            $('#subAppContainer').empty();
            
            // 启动子应用
            window.Wujie.startApp(subAppConfig);
            $('#startBtn').prop('disabled', true);
            $('#stopBtn').prop('disabled', false);
            $('#status').text('子应用启动中...');
            
            // 设置超时检查
            setTimeout(() => {
                // 检查子应用是否已启动
                const container = $('#subAppContainer');
                if (container.children().length > 0) {
                    $('#status').text('子应用运行中');
                    console.log('子应用启动成功');
                } else {
                    $('#status').text('子应用启动超时');
                    console.error('子应用启动超时');
                }
            }, 5000);
        } catch (error) {
            console.error('启动子应用失败:', error);
            $('#status').text('子应用启动失败: ' + error.message);
        }
    }
    
    // 停止子应用函数
    function stopSubApp() {
        console.log('停止子应用...');
        
        if (!window.Wujie) {
            console.error('Wujie 未加载');
            $('#status').text('Wujie 未加载');
            return;
        }
        
        try {
            // 停止子应用
            window.Wujie.destroyApp(subAppConfig.name);
            $('#startBtn').prop('disabled', false);
            $('#stopBtn').prop('disabled', true);
            $('#status').text('子应用已停止');
            
            // 清空容器
            $('#subAppContainer').html('<div class="empty-container">React 子应用 page2 将加载到这里...</div>');
        } catch (error) {
            console.error('停止子应用失败:', error);
            $('#status').text('子应用停止失败: ' + error.message);
        }
    }
    
    // 获取子应用状态函数
    function getSubAppStatus() {
        console.log('获取子应用状态...');
        
        if (!window.Wujie) {
            console.error('Wujie 未加载');
            $('#status').text('Wujie 未加载');
            return;
        }
        
        try {
            // 发送状态请求
            if (window.Wujie.bus) {
                window.Wujie.bus.$emit('status-request');
                console.log('已发送状态请求');
                $('#status').text('已发送状态请求');
            }
        } catch (error) {
            console.error('获取子应用状态失败:', error);
            $('#status').text('获取子应用状态失败: ' + error.message);
        }
    }
    
    // 设置通信函数
    function setupCommunication() {
        if (!window.Wujie || !window.Wujie.bus) {
            console.error('Wujie 通信总线未初始化');
            return;
        }
        
        // 监听来自子应用的消息
        window.Wujie.bus.$on('message-from-child', (data) => {
            console.log('收到子应用消息:', data);
            addMessageToList(data, 'child');
        });
        
        // 监听子应用的状态响应
        window.Wujie.bus.$on('status-response', (data) => {
            console.log('收到子应用状态:', data);
            addMessageToList(data, 'status');
            $('#status').text('子应用状态: ' + data.status);
        });
        
        console.log('通信设置完成');
    }
    
    // 添加消息到列表函数
    function addMessageToList(data, type) {
        const timestamp = new Date().toLocaleString();
        const messageHtml = `
            <li class="message-item">
                <strong>类型:</strong> ${type === 'child' ? '子应用消息' : '状态响应'}<br>
                <strong>内容:</strong> ${data.message || data.status}<br>
                <strong>时间:</strong> ${data.timestamp || timestamp}
            </li>
        `;
        $('#messages').prepend(messageHtml);
    }
    
    // 发送消息给子应用函数
    function sendMessageToChild() {
        const message = $('#messageInput').val().trim();
        
        if (!message) {
            alert('请输入消息内容');
            return;
        }
        
        if (!window.Wujie || !window.Wujie.bus) {
            console.error('Wujie 通信总线未初始化');
            $('#status').text('通信总线未初始化');
            return;
        }
        
        try {
            // 发送消息给子应用
            window.Wujie.bus.$emit('message-from-parent', {
                message: message,
                timestamp: new Date().toISOString()
            });
            
            // 添加到消息列表
            addMessageToList({
                message: message,
                timestamp: new Date().toISOString()
            }, 'parent');
            
            // 清空输入框
            $('#messageInput').val('');
            console.log('消息已发送:', message);
        } catch (error) {
            console.error('发送消息失败:', error);
            $('#status').text('发送消息失败: ' + error.message);
        }
    }
    
    // 绑定事件函数
    function bindEvents() {
        // 启动按钮点击事件
        $('#startBtn').on('click', startSubApp);
        
        // 停止按钮点击事件
        $('#stopBtn').on('click', stopSubApp);
        
        // 状态按钮点击事件
        $('#statusBtn').on('click', getSubAppStatus);
        
        // 发送消息按钮点击事件
        $('#sendBtn').on('click', sendMessageToChild);
        
        // 回车发送消息
        $('#messageInput').on('keypress', function(e) {
            if (e.which === 13) {
                sendMessageToChild();
            }
        });
        
        console.log('事件绑定完成');
    }
    
    // 初始化应用
    initApp();
});
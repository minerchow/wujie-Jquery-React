$(document).ready(function() {
    // 初始化 wujie 微前端配置
    let subAppInstance = null;
    window.Wujie = window.wujie;
    // 初始化应用
    function initApp() {
        console.log('初始化应用...');
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
            $('#status').text('应用已就绪');
            
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
        name: 'react-sub-app',
        url: 'http://localhost:3000', // React 子应用的 URL
        exec: true,
        // 传递给子应用的初始数据
        props: {
            parentAppName: 'jQuery 父应用',
            initialMessage: '来自父应用的问候',
            timestamp: new Date().toLocaleTimeString()
        },
        // 使用 Shadow DOM 模式
        shadow: true,
        // 子应用容器
        el: '#subAppContainer',
        // 添加路由配置
        route: {
            // 子应用路由前缀
            base: '/react-sub-app'
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
                        message: '欢迎来到微前端世界！这是来自父应用的自动消息。',
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
            $('#subAppContainer').html('<div class="empty-container">子应用将加载到这里...</div>');
        } catch (error) {
            console.error('停止子应用失败:', error);
            $('#status').text('子应用停止失败: ' + error.message);
        }
    }
    
    // 绑定事件
    function bindEvents() {
        console.log('绑定事件...');
        
        // 启动子应用按钮
        $('#startBtn').click(startSubApp);
        
        // 停止子应用按钮
        $('#stopBtn').click(stopSubApp);
        
        // 获取子应用状态按钮
        $('#statusBtn').click(() => {
            console.log('请求子应用状态');
            if (window.Wujie && window.Wujie.bus) {
                window.Wujie.bus.$emit('status-request');
                $('#messages').append(`<li><strong>父应用:</strong> 请求子应用状态 <span class="timestamp">(${new Date().toLocaleTimeString()})</span></li>`);
            } else {
                console.log('Wujie 未初始化，无法请求子应用状态');
                $('#status').text('Wujie 未初始化');
            }
        });
        
        // 发送消息按钮
        $('#sendBtn').click(() => {
            const message = $('#messageInput').val();
            if (message) {
                console.log('向子应用发送消息:', message);
                if (window.Wujie && window.Wujie.bus) {
                    window.Wujie.bus.$emit('message-from-parent', {
                        message: message,
                        timestamp: new Date().toLocaleTimeString()
                    });
                    $('#messages').append(`<li><strong>父应用:</strong> ${message} <span class="timestamp">(${new Date().toLocaleTimeString()})</span></li>`);
                    $('#messageInput').val('');
                } else {
                    console.log('Wujie 未初始化，无法发送消息');
                    $('#status').text('Wujie 未初始化');
                }
            }
        });
        
        // 回车发送消息
        $('#messageInput').keypress((e) => {
            if (e.which === 13) {
                $('#sendBtn').click();
            }
        });
    }
    
    // 设置通信
function setupCommunication() {
    console.log('设置子应用通信...');
    
    try {
        // 检查Wujie是否已加载
        if (typeof window.Wujie === 'undefined') {
            console.error('Wujie 未加载，无法设置通信');
            return;
        }
        
        // 检查bus对象是否可用
        if (typeof window.Wujie.bus === 'object') {
            // 监听来自子应用的消息
            window.Wujie.bus.$on('message-from-child', (data) => {
                console.log('收到子应用消息:', data);
                $('#messages').append(`<li><strong>子应用:</strong> ${data.message} <span class="timestamp">(${data.timestamp})</span></li>`);
            });
            
            // 监听子应用状态响应
            window.Wujie.bus.$on('status-response', (data) => {
                console.log('收到子应用状态:', data);
                $('#messages').append(`<li><strong>子应用状态:</strong> ${data.status} <span class="timestamp">(${data.timestamp})</span></li>`);
            });
        } else {
            console.warn('Wujie.bus 不可用，无法设置通信');
        }
    } catch (error) {
        console.error('设置通信失败:', error);
    }
}
    
    // 初始化应用
    initApp();
});
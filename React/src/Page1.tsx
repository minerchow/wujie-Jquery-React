import React, { useState, useEffect } from 'react';
import './Page.css';

// 定义消息类型
interface Message {
  message: string;
  timestamp?: number;
  sender?: string;
}

interface ExtraData {
  [key: string]: any;
}

interface ParentMessage extends Message {
  extraData?: ExtraData;
}

const Page1: React.FC = () => {
  const [messages, setMessages] = useState<ParentMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [parentAppName, setParentAppName] = useState('');
  const [initialMessage, setInitialMessage] = useState('');

  useEffect(() => {
    // 检测是否在 Wujie 环境中
    const isWujieEnvironment = window.__POWERED_BY_WUJIE__;
    
    if (isWujieEnvironment) {
      setIsConnected(true);
      
      // 获取父应用传递的 props
      const props = window.__WUJIE_PROPS__;
      if (props) {
        setParentAppName(props.parentAppName || '未知父应用');
        setInitialMessage(props.initialMessage || '');
        
        // 显示父应用传递的时间戳
        if (props.timestamp) {
          console.log('父应用时间戳:', props.timestamp);
        }
      }
      
      // 监听来自父应用的消息
      if (window.$wujie) {
        window.$wujie.bus.$on('message-from-parent', (data: ParentMessage) => {
          console.log('收到父应用消息:', data);
          setMessages(prev => [...prev, data]);
          
          // 如果是初始消息，可以添加特殊处理
          if (data.message && data.message.includes('欢迎来到微前端世界')) {
            console.log('收到父应用的初始欢迎消息');
          }
        });
        
        // 监听父应用的状态请求
        window.$wujie.bus.$on('status-request', () => {
          window.$wujie?.bus?.$emit('status-response', {
            status: 'React 子应用 Page1 运行中',
            timestamp: new Date().toISOString()
          });
        });
        
        // 向父应用发送初始状态
        window.$wujie.bus.$emit('status-response', {
          status: 'React 子应用 Page1 已加载',
          timestamp: new Date().toISOString()
        });
        
        // 向父应用发送初始消息
        window.$wujie.bus.$emit('message-from-child', {
          message: initialMessage || 'React 子应用 Page1 已启动',
          timestamp: new Date().toISOString()
        });
      }
    }
    
    // 清理函数
    return () => {
      if (isWujieEnvironment && window.$wujie) {
        // 组件卸载时清理事件监听
        window.$wujie.bus.$off('message-from-parent');
        window.$wujie.bus.$off('status-request');
      }
    };
  }, [initialMessage]);

  // 发送消息给父应用
  const sendMessageToParent = () => {
    if (inputMessage.trim() && window.$wujie) {
      const message = {
        message: inputMessage,
        timestamp: new Date().toISOString()
      };
      
      window.$wujie.bus.$emit('message-from-child', message);
      setInputMessage('');
    }
  };

  return (
    <div className="page-container">
      <div className="header">
        <h1>React 子应用 - Page 1</h1>
        <div>
          <span className={`status-indicator ${isConnected ? 'status-connected' : 'status-disconnected'}`}></span>
          {isConnected ? `已连接到 ${parentAppName}` : '未连接到父应用'}
        </div>
      </div>
      
      {initialMessage && (
        <div className="message-box">
          <h3>来自父应用的初始消息</h3>
          <p>{initialMessage}</p>
        </div>
      )}
      
      <div className="message-box">
        <h3>来自父应用的消息</h3>
        {messages.length > 0 ? (
          <div>
            {messages.map((msg, index) => (
              <div 
                key={index} 
                style={{ 
                  marginBottom: '10px', 
                  padding: '8px', 
                  backgroundColor: msg.message && msg.message.includes('欢迎来到微前端世界') ? '#e8f5e9' : '#f1f1f1', 
                  borderRadius: '4px',
                  border: msg.message && msg.message.includes('欢迎来到微前端世界') ? '1px solid #4caf50' : 'none'
                }}
              >
                <p><strong>消息:</strong> {msg.message}</p>
                <p><strong>时间:</strong> {msg.timestamp ? new Date(msg.timestamp).toLocaleString() : '未知'}</p>
                {msg.message && msg.message.includes('欢迎来到微前端世界') && (
                  <p style={{ color: '#4caf50', fontSize: '0.9em' }}>⭐ 初始欢迎消息</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>暂无来自父应用的消息</p>
        )}
      </div>
      
      <div className="control-panel">
        <h3>子应用控制面板</h3>
        <div>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="输入要发送给父应用的消息"
            onKeyPress={(e) => e.key === 'Enter' && sendMessageToParent()}
          />
          <button onClick={sendMessageToParent} disabled={!isConnected}>
            发送消息给父应用
          </button>
        </div>
      </div>
      
      <div style={{ marginTop: '20px', textAlign: 'center', color: '#666' }}>
        <p>这是运行在 Shadow DOM 中的 React 子应用 Page 1</p>
      </div>
    </div>
  );
};

export default Page1;
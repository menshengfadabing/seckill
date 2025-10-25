import { useEffect } from 'react';
import AppRouter from './router';
import { ToastProvider } from './components/Toast';

function App() {
  useEffect(() => {
    // 全局样式配置
    document.title = '秒杀系统管理后台';

    // 添加全局样式
    const style = document.createElement('style');
    style.textContent = `
      /* 自定义滚动条 */
      ::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }
      ::-webkit-scrollbar-track {
        background: #f1f1f1;
      }
      ::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 3px;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: #555;
      }

      /* Toast 动画 */
      @keyframes slide-in {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      .animate-slide-in {
        animation: slide-in 0.3s ease-out;
      }

      /* 去除默认边距 */
      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        padding: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
      }

      /* 响应式字体大小 */
      @media (max-width: 768px) {
        body {
          font-size: 14px;
        }
      }

      /* 移动端优化 */
      @media (max-width: 640px) {
        .mobile-hidden {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <ToastProvider>
      <AppRouter />
    </ToastProvider>
  );
}

export default App;

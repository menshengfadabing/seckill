import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import MainLayout from './components/Layout/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Products from './pages/Products';
import Seckill from './pages/Seckill';
import Orders from './pages/Orders';
import Settings from './pages/Settings';

// 路由守卫组件
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    if (!token) {
      window.location.href = '/admin/login';
    }
  }, [token]);

  if (!token) {
    return null;
  }

  return <>{children}</>;
};

// 公开路由组件
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('adminToken');

  if (token) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
};

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* 公开路由 - 登录页 */}
        <Route
          path="/admin/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* 受保护的路由 */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          {/* 嵌套路由 */}
          <Route path="dashboard" element={<Dashboard />} />

          {/* 临时重定向 */}
          <Route path="" element={<Navigate to="/admin/dashboard" replace />} />

          {/* 其他页面 */}
          <Route path="users" element={<Users />} />
          <Route path="products" element={<Products />} />
          <Route path="seckill" element={<Seckill />} />
          <Route path="orders" element={<Orders />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* 根路径重定向 */}
        <Route path="/" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
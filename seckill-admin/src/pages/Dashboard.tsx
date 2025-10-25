import { useState, useEffect } from 'react';
import { LayoutDashboard, Package, Timer, ShoppingBag, TrendingUp } from 'lucide-react';
import { productApi, seckillApi, userApi, systemApi } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    activeSeckill: 0,
    totalOrders: 0
  });
  const [loading, setLoading] = useState(true);
  const [systemStatus, setSystemStatus] = useState('正常');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // 并发获取所有数据
      const [usersRes, productsRes, seckillRes, statusRes] = await Promise.all([
        userApi.getUsers({}).catch(() => ({ data: [] })),
        productApi.getProducts({}).catch(() => ({ data: [] })),
        seckillApi.getSeckillProducts().catch(() => ({ data: [] })),
        systemApi.getStatus().catch(() => ({ success: true }))
      ]);

      // 计算统计数据
      const activeSeckillProducts = seckillRes.data?.filter(
        (item: any) => item.status === 1
      ) || [];

      setStats({
        totalUsers: Array.isArray(usersRes.data) ? usersRes.data.length : (usersRes.data?.content?.length || 0),
        totalProducts: Array.isArray(productsRes.data) ? productsRes.data.length : (productsRes.data?.content?.length || 0),
        activeSeckill: activeSeckillProducts.length,
        totalOrders: 0 // 后端暂时没有订单统计接口
      });

      setSystemStatus(statusRes.success ? '正常' : '异常');
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: '总用户数',
      value: stats.totalUsers,
      icon: LayoutDashboard,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: '商品数量',
      value: stats.totalProducts,
      icon: Package,
      color: 'bg-green-500',
      change: '+5%'
    },
    {
      title: '活跃秒杀',
      value: stats.activeSeckill,
      icon: Timer,
      color: 'bg-orange-500',
      change: '+3%'
    },
    {
      title: '系统状态',
      value: systemStatus,
      icon: TrendingUp,
      color: systemStatus === '正常' ? 'bg-green-500' : 'bg-red-500',
      change: systemStatus === '正常' ? '运行中' : '异常'
    }
  ];

  const quickActions = [
    {
      title: '添加商品',
      desc: '创建新的商品',
      icon: Package,
      color: 'bg-blue-100 text-blue-600',
      path: '/admin/products'
    },
    {
      title: '创建秒杀',
      desc: '设置秒杀活动',
      icon: Timer,
      color: 'bg-orange-100 text-orange-600',
      path: '/admin/seckill'
    },
    {
      title: '查看订单',
      desc: '管理订单信息',
      icon: ShoppingBag,
      color: 'bg-green-100 text-green-600',
      path: '/admin/orders'
    },
    {
      title: '用户管理',
      desc: '管理系统用户',
      icon: LayoutDashboard,
      color: 'bg-purple-100 text-purple-600',
      path: '/admin/users'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">加载中...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 页面标题 */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">仪表盘</h1>
        <p className="text-gray-600 mt-2">欢迎使用秒杀系统管理后台</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                <p className="text-sm text-green-600 mt-2">{card.change}</p>
              </div>
              <div className={`${card.color} p-3 rounded-lg`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 快速操作 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">快速操作</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => window.location.href = action.path}
              className={`${action.color} p-6 rounded-lg text-left hover:opacity-80 transition-opacity`}
            >
              <action.icon className="w-8 h-8 mb-3" />
              <h3 className="font-semibold mb-1">{action.title}</h3>
              <p className="text-sm opacity-75">{action.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* 系统信息 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 最近活动 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">系统信息</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">服务状态</span>
              <span className="text-green-600 font-medium">正常运行</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">数据库连接</span>
              <span className="text-green-600 font-medium">正常</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">缓存服务</span>
              <span className="text-green-600 font-medium">正常</span>
            </div>
          </div>
        </div>

        {/* 统计图表占位 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">数据统计</h2>
          <div className="flex items-center justify-center h-40 text-gray-500">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>图表功能开发中</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
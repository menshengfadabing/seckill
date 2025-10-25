import { useState, useEffect } from 'react';
import { Plus, Search, Timer, Edit, Trash2, Play, Loader } from 'lucide-react';
import { seckillApi } from '../services/api';
import type { SeckillProduct } from '../types';

const Seckill = () => {
  const [seckillProducts, setSeckillProducts] = useState<SeckillProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [preloadingId, setPreloadingId] = useState<number | null>(null);

  useEffect(() => {
    loadSeckillProducts();
  }, []);

  const loadSeckillProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await seckillApi.getSeckillProducts();
      if (response.success) {
        setSeckillProducts(response.data || []);
      } else {
        setError(response.message || '获取秒杀商品列表失败');
      }
    } catch (err) {
      console.error('Failed to load seckill products:', err);
      setError('网络错误，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handlePreloadSeckill = async (id: number) => {
    try {
      setPreloadingId(id);
      const response = await seckillApi.preloadSeckill(id);
      if (response.success) {
        setSeckillProducts(seckillProducts.map(product =>
          product.id === id ? { ...product, preloaded: true } : product
        ));
        alert('库存预热成功');
      } else {
        alert(response.message || '库存预热失败');
      }
    } catch (err) {
      console.error('Failed to preload seckill:', err);
      alert('网络错误，请重试');
    } finally {
      setPreloadingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('zh-CN');
  };

  const getStatusBadge = (product: SeckillProduct) => {
    const now = new Date().getTime();
    const startTime = new Date(product.startTime).getTime();
    const endTime = new Date(product.endTime).getTime();

    if (product.stockCount <= 0) {
      return 'bg-orange-100 text-orange-800'; // 已售罄
    } else if (now < startTime) {
      return 'bg-blue-100 text-blue-800'; // 未开始
    } else if (now > endTime) {
      return 'bg-gray-100 text-gray-800'; // 已结束
    } else {
      return 'bg-green-100 text-green-800'; // 进行中
    }
  };

  const getStatusText = (product: SeckillProduct) => {
    const now = new Date().getTime();
    const startTime = new Date(product.startTime).getTime();
    const endTime = new Date(product.endTime).getTime();

    if (product.stockCount <= 0) {
      return '已售罄';
    } else if (now < startTime) {
      return '未开始';
    } else if (now > endTime) {
      return '已结束';
    } else {
      return '进行中';
    }
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">秒杀管理</h1>
          <p className="text-gray-600 mt-1">管理秒杀活动和库存预热</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          创建秒杀
        </button>
      </div>

      {/* 搜索栏 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="搜索商品名称..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            搜索
          </button>
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* 秒杀商品表格 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-600">加载中...</div>
          </div>
        ) : seckillProducts.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-gray-500">
            <div className="text-center">
              <Timer className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>暂无秒杀商品</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    商品名称
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    秒杀价格
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    库存
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    活动时间
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状态
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {seckillProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {product.productName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-red-600">
                        ¥{product.seckillPrice}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-900">库存: {product.stockCount}</span>
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{
                              width: `${Math.max(10, (product.stockCount / 100) * 100)}%`
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>
                        <div>开始: {formatDateTime(product.startTime)}</div>
                        <div>结束: {formatDateTime(product.endTime)}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(product)}`}>
                        {getStatusText(product)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handlePreloadSeckill(product.id)}
                          disabled={preloadingId === product.id || product.preloaded}
                          className={`flex items-center px-2 py-1 text-xs rounded transition-colors ${
                            product.preloaded
                              ? 'bg-gray-100 text-gray-600 cursor-not-allowed'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {preloadingId === product.id ? (
                            <>
                              <Loader className="w-3 h-3 mr-1 animate-spin" />
                              预热中
                            </>
                          ) : product.preloaded ? (
                            '已预热'
                          ) : (
                            <>
                              <Play className="w-3 h-3 mr-1" />
                              预热
                            </>
                          )}
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 统计信息 */}
      <div className="flex items-center justify-between text-sm text-gray-700">
        <span>
          显示 <span className="font-medium">{seckillProducts.length}</span> 个秒杀商品
        </span>
      </div>

      {/* 创建秒杀模态框 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h2 className="text-xl font-semibold mb-4">创建秒杀活动</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  选择商品
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                  <option value="">请选择商品</option>
                  <option value="1">测试商品1</option>
                  <option value="2">测试商品2</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  秒杀价格
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="请输入秒杀价格"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  秒杀库存
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="请输入秒杀库存"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  开始时间
                </label>
                <input
                  type="datetime-local"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  结束时间
                </label>
                <input
                  type="datetime-local"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                取消
              </button>
              <button className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                创建
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Seckill;
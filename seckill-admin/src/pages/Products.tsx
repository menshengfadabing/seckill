import { useState, useEffect } from 'react';
import { Plus, Search, Package, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { productApi } from '../services/api';
import type { Product } from '../types';

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await productApi.getProducts({});
      if (response.success) {
        setProducts(response.data?.records || response.data || []);
      } else {
        setError(response.message || '获取商品列表失败');
      }
    } catch (err) {
      console.error('Failed to load products:', err);
      setError('网络错误，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const params = searchKeyword ? { keyword: searchKeyword } : {};
      const response = await productApi.getProducts(params);
      if (response.success) {
        setProducts(response.data?.records || response.data || []);
      } else {
        setError(response.message || '搜索失败');
      }
    } catch (err) {
      console.error('Search failed:', err);
      setError('搜索失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowAddModal(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowAddModal(true);
  };

  const handleToggleStatus = async (product: Product) => {
    try {
      const newStatus = product.status === 1 ? 0 : 1;
      const response = await productApi.updateProductStatus(product.id, newStatus);
      if (response.success) {
        setProducts(products.map(p =>
          p.id === product.id ? { ...p, status: newStatus } : p
        ));
      } else {
        alert(response.message || '更新状态失败');
      }
    } catch (err) {
      console.error('Failed to update product status:', err);
      alert('网络错误，请重试');
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('确定要删除这个商品吗？')) {
      return;
    }

    try {
      const response = await productApi.deleteProduct(id);
      if (response.success) {
        setProducts(products.filter(p => p.id !== id));
      } else {
        alert(response.message || '删除失败');
      }
    } catch (err) {
      console.error('Failed to delete product:', err);
      alert('网络错误，请重试');
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  const getStatusBadge = (status: number) => {
    return status === 1
      ? 'bg-green-100 text-green-800'
      : 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: number) => {
    return status === 1 ? '上架' : '下架';
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">商品管理</h1>
          <p className="text-gray-600 mt-1">管理商品信息</p>
        </div>
        <button
          onClick={handleAddProduct}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          添加商品
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
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
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

      {/* 商品网格 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-600">加载中...</div>
          </div>
        ) : products.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-gray-500">
            <div className="text-center">
              <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>暂无商品数据</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                {/* 商品图片占位 */}
                <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <Package className="w-12 h-12 text-gray-400" />
                </div>

                {/* 商品信息 */}
                <h3 className="font-semibold text-gray-900 mb-2 truncate">{product.productName}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2 h-10">
                  {product.productDesc || '暂无描述'}
                </p>

                {/* 价格和库存 */}
                <div className="flex justify-between items-center mb-3">
                  <span className="text-lg font-bold text-blue-600">¥{product.price}</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    product.stockCount > 10 ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                  }`}>
                    库存: {product.stockCount}
                  </span>
                </div>

                {/* 状态标签 */}
                <div className="flex justify-between items-center mb-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(product.status)}`}>
                    {getStatusText(product.status)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {formatDate(product.createTime)}
                  </span>
                </div>

                {/* 操作按钮 */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    编辑
                  </button>
                  <button
                    onClick={() => handleToggleStatus(product)}
                    className={`flex-1 flex items-center justify-center px-3 py-2 rounded-lg transition-colors text-sm ${
                      product.status === 1
                        ? 'bg-orange-500 text-white hover:bg-orange-600'
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                  >
                    {product.status === 1 ? (
                      <>
                        <ToggleLeft className="w-3 h-3 mr-1" />
                        下架
                      </>
                    ) : (
                      <>
                        <ToggleRight className="w-3 h-3 mr-1" />
                        上架
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 统计信息 */}
      <div className="flex items-center justify-between text-sm text-gray-700">
        <span>
          显示 <span className="font-medium">{products.length}</span> 个商品
        </span>
      </div>

      {/* 添加/编辑商品模态框 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingProduct ? '编辑商品' : '添加商品'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  商品名称
                </label>
                <input
                  type="text"
                  defaultValue={editingProduct?.productName || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="请输入商品名称"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  商品描述
                </label>
                <textarea
                  rows={3}
                  defaultValue={editingProduct?.productDesc || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="请输入商品描述"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  价格
                </label>
                <input
                  type="number"
                  step="0.01"
                  defaultValue={editingProduct?.price || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="请输入商品价格"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  库存数量
                </label>
                <input
                  type="number"
                  defaultValue={editingProduct?.stockCount || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="请输入库存数量"
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
                {editingProduct ? '保存' : '添加'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
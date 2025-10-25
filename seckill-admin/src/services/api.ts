import axios from 'axios';
import type { User, Product, SeckillProduct, Order, DashboardStats, ApiResponse, PageResponse, SearchParams } from '../types';

// 创建axios实例
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000,
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 可以在这里添加token等认证信息
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// 用户管理API (基于后端实际接口)
export const userApi = {
  getUsers: (params: SearchParams): Promise<ApiResponse<User[]>> => {
    return api.get('/users', { params });
  },
  getUserById: (id: number): Promise<ApiResponse<User>> => {
    return api.get(`/users/${id}`);
  },
  getUserByUsername: (username: string): Promise<ApiResponse<User>> => {
    return api.get(`/users/username/${username}`);
  }
};

// 商品管理API
export const productApi = {
  getProducts: (params: SearchParams): Promise<ApiResponse<PageResponse<Product>>> => {
    return api.get('/products', { params });
  },
  createProduct: (data: Partial<Product>): Promise<ApiResponse<Product>> => {
    return api.post('/products', data);
  },
  updateProduct: (id: number, data: Partial<Product>): Promise<ApiResponse<Product>> => {
    return api.put(`/products/${id}`, data);
  },
  deleteProduct: (id: number): Promise<ApiResponse> => {
    return api.delete(`/products/${id}`);
  },
  updateProductStatus: (id: number, status: number): Promise<ApiResponse> => {
    return api.put(`/products/${id}/status`, { status });
  }
};

// 秒杀管理API (基于后端实际接口)
export const seckillApi = {
  getSeckillProducts: (): Promise<ApiResponse<SeckillProduct[]>> => {
    return api.get('/seckill/list');
  },
  getSeckillProductById: (id: number): Promise<ApiResponse<SeckillProduct>> => {
    return api.get(`/seckill/product/${id}`);
  },
  createSeckillProduct: (data: Partial<SeckillProduct>): Promise<ApiResponse<SeckillProduct>> => {
    return api.post('/seckill/add', data);
  },
  preloadSeckill: (id: number): Promise<ApiResponse> => {
    return api.post(`/seckill/preload/${id}`);
  },
  doSeckill: (userId: number, seckillId: number): Promise<ApiResponse> => {
    return api.post('/seckill/do', { userId, seckillId });
  },
  checkUserSeckill: (userId: number, seckillId: number): Promise<ApiResponse> => {
    return api.get(`/seckill/check/${userId}/${seckillId}`);
  }
};

// 订单管理API (基于后端实际接口)
export const orderApi = {
  getUserOrders: (userId: number): Promise<ApiResponse<Order[]>> => {
    return api.get(`/seckill/orders/${userId}`);
  },
  getOrderDetail: (orderNo: string): Promise<ApiResponse<Order>> => {
    return api.get(`/seckill/order/${orderNo}`);
  }
};

// 系统API (基于后端实际接口)
export const systemApi = {
  getStatus: (): Promise<ApiResponse> => {
    return api.post('/status');
  }
};

// 认证API
export const authApi = {
  login: (username: string, password: string): Promise<ApiResponse<{ token: string }>> => {
    return api.post('/users/login', { username, password });
  }
};

export default api;
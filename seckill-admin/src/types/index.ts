// 用户相关类型
export interface User {
  id: number;
  username: string;
  createTime: string;
  status: number; // 1-正常 0-禁用
}

// 商品相关类型
export interface Product {
  id: number;
  productName: string;
  productDesc: string;
  price: number;
  stockCount: number;
  status: number; // 1-上架 0-下架
  createTime: string;
}

// 秒杀商品相关类型
export interface SeckillProduct {
  id: number;
  productId: number;
  productName: string;
  originalPrice?: number;
  seckillPrice: number;
  stockCount: number;
  startTime: string;
  endTime: string;
  status: number; // 1-正常 0-结束
  createTime: string;
  preloaded?: boolean;
}

// 订单相关类型
export interface Order {
  id: number;
  orderNo: string;
  userId: number;
  username: string;
  productId: number;
  productName: string;
  seckillPrice: number;
  status: number; // 0-成功 1-失败
  createTime: string;
}

// 仪表盘统计数据类型
export interface DashboardStats {
  totalUsers: number;
  todayOrders: number;
  activeSeckill: number;
  systemLoad: number;
}

// API响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message: string;
}

// 分页响应类型
export interface PageResponse<T> {
  records: T[];
  total: number;
  current: number;
  size: number;
  pages: number;
}

// 搜索参数类型
export interface SearchParams {
  page?: number;
  size?: number;
  keyword?: string;
  status?: number;
  startDate?: string;
  endDate?: string;
}
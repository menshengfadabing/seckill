import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Package,
  Timer,
  ShoppingBag,
  Settings,
  X
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  isMobile?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  navigate: (path: string) => void;
}

const Sidebar = ({ isCollapsed, isMobile = false, isOpen = true, onClose, navigate }: SidebarProps) => {
  const menuItems = [
    {
      path: '/admin/dashboard',
      icon: LayoutDashboard,
      text: '仪表盘'
    },
    {
      path: '/admin/users',
      icon: Users,
      text: '用户管理'
    },
    {
      path: '/admin/products',
      icon: Package,
      text: '商品管理'
    },
    {
      path: '/admin/seckill',
      icon: Timer,
      text: '秒杀管理'
    },
    {
      path: '/admin/orders',
      icon: ShoppingBag,
      text: '订单管理'
    },
    {
      path: '/admin/settings',
      icon: Settings,
      text: '系统设置'
    }
  ];

  const handleMenuItemClick = (path: string) => {
    navigate(path);
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* 桌面端侧边栏 */}
      {!isMobile && (
        <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-gray-900 h-full transition-all duration-300 text-white flex-shrink-0`}>
          <div className="p-4 border-b border-gray-800">
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-white">
                S
              </div>
              {!isCollapsed && (
                <span className="ml-3 text-xl font-semibold">秒杀后台</span>
              )}
            </div>
          </div>

          <nav className="mt-8">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200
                  ${isActive ? 'bg-gray-800 text-white border-r-4 border-blue-500' : ''}
                  ${isCollapsed ? 'justify-center' : ''}
                `}
              >
                <item.icon size={20} />
                {!isCollapsed && (
                  <span className="ml-3">{item.text}</span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      )}

      {/* 移动端侧边栏 */}
      {isMobile && (
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          {/* 移动端头部 */}
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-white">
                S
              </div>
              <span className="ml-3 text-xl font-semibold">秒杀后台</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* 移动端导航 */}
          <nav className="mt-8">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleMenuItemClick(item.path)}
                className="w-full flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200"
              >
                <item.icon size={20} />
                <span className="ml-3">{item.text}</span>
              </button>
            ))}
          </nav>
        </div>
      )}
    </>
  );
};

export default Sidebar;
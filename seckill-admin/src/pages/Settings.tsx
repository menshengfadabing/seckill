import { useState, useEffect } from 'react';
import { Save, RotateCcw, Bell, Shield, Database, Upload } from 'lucide-react';
import api from '../services/api';

interface SystemSettings {
  // 基础设置
  systemName: string;
  systemLogo: string;
  adminEmail: string;
  maxUsers: number;

  // 秒杀设置
  defaultSeckillLimit: number;
  preheatTimeMinutes: number;
  maxConcurrentOrders: number;
  orderTimeoutMinutes: number;

  // 通知设置
  emailNotifications: boolean;
  smsNotifications: boolean;
  orderEmailEnabled: boolean;
  lowStockAlertEnabled: boolean;
  lowStockThreshold: number;

  // 安全设置
  passwordMinLength: number;
  sessionTimeoutMinutes: number;
  maxLoginAttempts: number;
  enableTwoFactor: boolean;
}

const Settings = () => {
  const [activeTab, setActiveTab] = useState('basic');
  const [settings, setSettings] = useState<SystemSettings>({
    systemName: '电商秒杀系统',
    systemLogo: '',
    adminEmail: 'admin@seckill.com',
    maxUsers: 10000,

    defaultSeckillLimit: 1,
    preheatTimeMinutes: 30,
    maxConcurrentOrders: 1000,
    orderTimeoutMinutes: 15,

    emailNotifications: true,
    smsNotifications: false,
    orderEmailEnabled: true,
    lowStockAlertEnabled: true,
    lowStockThreshold: 10,

    passwordMinLength: 6,
    sessionTimeoutMinutes: 120,
    maxLoginAttempts: 5,
    enableTwoFactor: false,
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // 获取系统设置
  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/settings');
      if (response.data) {
        setSettings(response.data);
      }
    } catch (err) {
      console.error('获取系统设置失败:', err);
      showMessage('获取系统设置失败', 'error');
    } finally {
      setLoading(false);
    }
  };

  // 保存系统设置
  const saveSettings = async () => {
    try {
      setSaving(true);
      await api.put('/api/settings', settings);
      showMessage('设置保存成功', 'success');
    } catch (err) {
      console.error('保存设置失败:', err);
      showMessage('保存设置失败', 'error');
    } finally {
      setSaving(false);
    }
  };

  // 重置设置
  const resetSettings = () => {
    if (confirm('确定要重置所有设置为默认值吗？')) {
      setSettings({
        systemName: '电商秒杀系统',
        systemLogo: '',
        adminEmail: 'admin@seckill.com',
        maxUsers: 10000,

        defaultSeckillLimit: 1,
        preheatTimeMinutes: 30,
        maxConcurrentOrders: 1000,
        orderTimeoutMinutes: 15,

        emailNotifications: true,
        smsNotifications: false,
        orderEmailEnabled: true,
        lowStockAlertEnabled: true,
        lowStockThreshold: 10,

        passwordMinLength: 6,
        sessionTimeoutMinutes: 120,
        maxLoginAttempts: 5,
        enableTwoFactor: false,
      });
      showMessage('设置已重置为默认值', 'success');
    }
  };

  // 显示消息
  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  // 更新设置
  const updateSetting = (key: keyof SystemSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const tabs = [
    { id: 'basic', label: '基础设置', icon: Database },
    { id: 'seckill', label: '秒杀设置', icon: Shield },
    { id: 'notification', label: '通知设置', icon: Bell },
    { id: 'security', label: '安全设置', icon: Shield },
  ];

  return (
    <div className="p-6">
      {/* 页面标题 */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">系统设置</h1>
        <div className="flex space-x-3">
          <button
            onClick={resetSettings}
            className="flex items-center px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            重置
          </button>
          <button
            onClick={saveSettings}
            disabled={saving}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? '保存中...' : '保存设置'}
          </button>
        </div>
      </div>

      {/* 消息提示 */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg border ${
          message.type === 'success'
            ? 'bg-green-50 border-green-200 text-green-700'
            : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* 标签导航 */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* 设置内容 */}
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-500">加载设置中...</p>
            </div>
          ) : (
            <>
              {/* 基础设置 */}
              {activeTab === 'basic' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">基础设置</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        系统名称
                      </label>
                      <input
                        type="text"
                        value={settings.systemName}
                        onChange={(e) => updateSetting('systemName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        管理员邮箱
                      </label>
                      <input
                        type="email"
                        value={settings.adminEmail}
                        onChange={(e) => updateSetting('adminEmail', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        最大用户数
                      </label>
                      <input
                        type="number"
                        value={settings.maxUsers}
                        onChange={(e) => updateSetting('maxUsers', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        系统Logo
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          id="logo-upload"
                        />
                        <label
                          htmlFor="logo-upload"
                          className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          上传Logo
                        </label>
                        <span className="text-sm text-gray-500">
                          {settings.systemLogo || '未上传'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 秒杀设置 */}
              {activeTab === 'seckill' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">秒杀设置</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        默认每人限购数量
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={settings.defaultSeckillLimit}
                        onChange={(e) => updateSetting('defaultSeckillLimit', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="mt-1 text-sm text-gray-500">用户在秒杀活动中默认可购买的最大数量</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        库存预热时间（分钟）
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={settings.preheatTimeMinutes}
                        onChange={(e) => updateSetting('preheatTimeMinutes', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="mt-1 text-sm text-gray-500">秒杀开始前多少分钟开始预热</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        最大并发订单数
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={settings.maxConcurrentOrders}
                        onChange={(e) => updateSetting('maxConcurrentOrders', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="mt-1 text-sm text-gray-500">系统同时处理的最大订单数量</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        订单超时时间（分钟）
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={settings.orderTimeoutMinutes}
                        onChange={(e) => updateSetting('orderTimeoutMinutes', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="mt-1 text-sm text-gray-500">订单未支付的超时时间</p>
                    </div>
                  </div>
                </div>
              )}

              {/* 通知设置 */}
              {activeTab === 'notification' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">通知设置</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">邮件通知</h4>
                        <p className="text-sm text-gray-500">启用系统邮件通知功能</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.emailNotifications}
                          onChange={(e) => updateSetting('emailNotifications', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">短信通知</h4>
                        <p className="text-sm text-gray-500">启用系统短信通知功能</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.smsNotifications}
                          onChange={(e) => updateSetting('smsNotifications', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">订单邮件通知</h4>
                        <p className="text-sm text-gray-500">用户下单后发送邮件通知</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.orderEmailEnabled}
                          onChange={(e) => updateSetting('orderEmailEnabled', e.target.checked)}
                          disabled={!settings.emailNotifications}
                          className="sr-only peer"
                        />
                        <div className={`w-11 h-6 rounded-full peer after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
                          settings.emailNotifications
                            ? 'bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:bg-blue-600 peer-checked:after:translate-x-full'
                            : 'bg-gray-100 opacity-50 cursor-not-allowed'
                        }`}></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">低库存警告</h4>
                        <p className="text-sm text-gray-500">当商品库存低于阈值时发送警告</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.lowStockAlertEnabled}
                          onChange={(e) => updateSetting('lowStockAlertEnabled', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    {settings.lowStockAlertEnabled && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          低库存阈值
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={settings.lowStockThreshold}
                          onChange={(e) => updateSetting('lowStockThreshold', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p className="mt-1 text-sm text-gray-500">当库存低于此数值时触发警告</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 安全设置 */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">安全设置</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        密码最小长度
                      </label>
                      <input
                        type="number"
                        min="4"
                        max="20"
                        value={settings.passwordMinLength}
                        onChange={(e) => updateSetting('passwordMinLength', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="mt-1 text-sm text-gray-500">用户密码的最小长度要求</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        会话超时时间（分钟）
                      </label>
                      <input
                        type="number"
                        min="10"
                        value={settings.sessionTimeoutMinutes}
                        onChange={(e) => updateSetting('sessionTimeoutMinutes', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="mt-1 text-sm text-gray-500">管理员会话的超时时间</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        最大登录尝试次数
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={settings.maxLoginAttempts}
                        onChange={(e) => updateSetting('maxLoginAttempts', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="mt-1 text-sm text-gray-500">连续登录失败后锁定账户的次数</p>
                    </div>

                    <div className="flex items-center justify-between pt-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">双因子认证</h4>
                        <p className="text-sm text-gray-500">启用管理员双因子认证</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.enableTwoFactor}
                          onChange={(e) => updateSetting('enableTwoFactor', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
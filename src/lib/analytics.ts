/**
 * 埋点 SDK - 用于采集网站访问数据
 */

import { API_BASE, CURRENT_SUBDOMAIN } from './tenant-config';

// 埋点端点
const TRACKING_ENDPOINT = `${API_BASE}/api/v1/track`;

// 存储键名
const VISITOR_ID_KEY = '_vid';
const SESSION_ID_KEY = '_sid';
const SESSION_EXPIRY = 30 * 60 * 1000; // 30分钟会话过期
const WIDGET_DISMISSED_KEY = '_wd'; // 浮窗关闭记录

// 设备类型
type DeviceType = 'mobile' | 'tablet' | 'desktop';

// 来源类型
type SourceType = 'DIRECT' | 'QRCODE' | 'LINK' | 'SEARCH' | 'SOCIAL' | 'REFERRAL';

// 追踪数据接口
interface TrackingData {
  visitorId: string;
  sessionId: string;
  tenantId: string;
  path: string;
  module?: string;
  enterTime?: string;
  timestamp?: string;
  duration?: number;
  sourceType?: SourceType;
  sourceDetail?: string;
  device?: DeviceType;
  browser?: string;
  os?: string;
}

// 模块追踪状态
interface ModuleTrackingState {
  enterTime: number;
  module: string;
}

// 全局状态
let visitorId: string = '';
let sessionId: string = '';
let tenantId: string = '';
let moduleStates: Map<string, ModuleTrackingState> = new Map();
let isInitialized = false;

/**
 * 生成唯一 ID
 */
function generateId(): string {
  return `${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * 获取存储的值
 */
function getStorageItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

/**
 * 设置存储的值
 */
function setStorageItem(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // ignore
  }
}

/**
 * 检测设备类型
 */
function detectDevice(): DeviceType {
  const ua = navigator.userAgent.toLowerCase();
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (
    /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
      ua
    )
  ) {
    return 'mobile';
  }
  return 'desktop';
}

/**
 * 检测浏览器
 */
function detectBrowser(): string {
  const ua = navigator.userAgent;
  if (ua.includes('Edg/')) return 'Edge';
  if (ua.includes('Chrome/')) return 'Chrome';
  if (ua.includes('Firefox/')) return 'Firefox';
  if (ua.includes('Safari/') && !ua.includes('Chrome')) return 'Safari';
  if (ua.includes('Opera') || ua.includes('OPR/')) return 'Opera';
  if (ua.includes('MSIE') || ua.includes('Trident/')) return 'IE';
  return 'Unknown';
}

/**
 * 检测操作系统
 */
function detectOS(): string {
  const ua = navigator.userAgent;
  if (ua.includes('Win')) return 'Windows';
  if (ua.includes('Mac')) return 'MacOS';
  if (ua.includes('Linux')) return 'Linux';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
  return 'Unknown';
}

/**
 * 检测来源类型
 */
function detectSourceType(): { type: SourceType; detail?: string } {
  // 检查 URL 参数中是否有来源标识
  const urlParams = new URLSearchParams(window.location.search);

  // 扫码访问（通过 qrcode 参数标识）
  if (urlParams.get('qrcode') || urlParams.get('src') === 'qr') {
    return { type: 'QRCODE', detail: urlParams.get('qrcode') || undefined };
  }

  // 社交媒体
  if (urlParams.get('src') === 'social') {
    return { type: 'SOCIAL', detail: urlParams.get('from') || undefined };
  }

  // 检查 referrer
  const referrer = document.referrer;

  if (!referrer) {
    return { type: 'DIRECT' };
  }

  try {
    const referrerUrl = new URL(referrer);
    const referrerHost = referrerUrl.hostname;

    // 搜索引擎
    const searchEngines = ['google', 'bing', 'baidu', 'sogou', '360', 'yandex', 'duckduckgo'];
    if (searchEngines.some((se) => referrerHost.includes(se))) {
      return { type: 'SEARCH', detail: referrerHost };
    }

    // 社交媒体
    const socialPlatforms = [
      'weibo',
      'weixin',
      'wechat',
      'twitter',
      'facebook',
      'linkedin',
      'xiaohongshu',
      'douyin',
      'tiktok',
      'zhihu',
    ];
    if (socialPlatforms.some((sp) => referrerHost.includes(sp))) {
      return { type: 'SOCIAL', detail: referrerHost };
    }

    // 外部链接
    const currentHost = window.location.hostname;
    if (referrerHost !== currentHost) {
      return { type: 'REFERRAL', detail: referrerHost };
    }
  } catch {
    // URL 解析失败，当作直接访问
  }

  return { type: 'LINK' };
}

/**
 * 发送追踪请求
 */
async function sendTrackingRequest(type: string, data: Partial<TrackingData>): Promise<void> {
  try {
    await fetch(TRACKING_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type,
        visitorId,
        sessionId,
        tenantId,
        ...data,
      }),
    });
  } catch (error) {
    console.error('Tracking error:', error);
  }
}

/**
 * 初始化埋点 SDK
 */
export async function initAnalytics(tenant: string): Promise<void> {
  if (isInitialized) return;

  tenantId = tenant;

  // 尝试从 localStorage 获取 visitorId
  const storedVisitorId = getStorageItem(VISITOR_ID_KEY);
  if (storedVisitorId) {
    visitorId = storedVisitorId;
  } else {
    // 从服务器获取新的 visitorId
    try {
      const res = await fetch(`${TRACKING_ENDPOINT}?init=1`);
      const data = await res.json();
      if (data.success && data.data) {
        visitorId = data.data.visitorId;
        sessionId = data.data.sessionId;
        setStorageItem(VISITOR_ID_KEY, visitorId);
        isInitialized = true;
        return;
      }
    } catch {
      // 使用本地生成的 ID
    }
    visitorId = generateId();
    setStorageItem(VISITOR_ID_KEY, visitorId);
  }

  // 检查会话是否过期
  const sessionData = getStorageItem(SESSION_ID_KEY);
  if (sessionData) {
    try {
      const { sid, exp } = JSON.parse(sessionData);
      if (Date.now() < exp) {
        sessionId = sid;
        // 延长会话过期时间
        setStorageItem(
          SESSION_ID_KEY,
          JSON.stringify({ sid, exp: Date.now() + SESSION_EXPIRY })
        );
      } else {
        // 会话过期，创建新会话
        sessionId = generateId();
        setStorageItem(
          SESSION_ID_KEY,
          JSON.stringify({ sid: sessionId, exp: Date.now() + SESSION_EXPIRY })
        );
      }
    } catch {
      sessionId = generateId();
      setStorageItem(
        SESSION_ID_KEY,
        JSON.stringify({ sid: sessionId, exp: Date.now() + SESSION_EXPIRY })
      );
    }
  } else {
    sessionId = generateId();
    setStorageItem(
      SESSION_ID_KEY,
      JSON.stringify({ sid: sessionId, exp: Date.now() + SESSION_EXPIRY })
    );
  }

  isInitialized = true;
}

/**
 * 追踪页面浏览
 */
export async function trackPageview(path?: string): Promise<void> {
  if (!isInitialized) {
    await initAnalytics(CURRENT_SUBDOMAIN);
  }

  const source = detectSourceType();

  await sendTrackingRequest('pageview', {
    path: path || window.location.pathname,
    enterTime: new Date().toISOString(),
    sourceType: source.type,
    sourceDetail: source.detail,
    device: detectDevice(),
    browser: detectBrowser(),
    os: detectOS(),
  });
}

/**
 * 追踪模块进入
 */
export async function trackModuleEnter(module: string): Promise<void> {
  if (!isInitialized) {
    await initAnalytics(CURRENT_SUBDOMAIN);
  }

  // 记录进入时间
  moduleStates.set(module, {
    enterTime: Date.now(),
    module,
  });

  await sendTrackingRequest('module-enter', {
    module,
    timestamp: new Date().toISOString(),
  });
}

/**
 * 追踪模块退出
 */
export async function trackModuleExit(module: string): Promise<void> {
  if (!isInitialized) {
    await initAnalytics(CURRENT_SUBDOMAIN);
  }

  const state = moduleStates.get(module);
  const duration = state ? Date.now() - state.enterTime : undefined;

  // 清除状态
  moduleStates.delete(module);

  await sendTrackingRequest('module-exit', {
    module,
    timestamp: new Date().toISOString(),
    duration,
  });
}

/**
 * 获取浮窗关闭状态
 */
export function isWidgetDismissed(): boolean {
  const data = getStorageItem(WIDGET_DISMISSED_KEY);
  if (!data) return false;

  try {
    const { exp } = JSON.parse(data);
    return Date.now() < exp;
  } catch {
    return false;
  }
}

/**
 * 设置浮窗已关闭（7天内不再显示）
 */
export function setWidgetDismissed(): void {
  const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
  setStorageItem(
    WIDGET_DISMISSED_KEY,
    JSON.stringify({ exp: Date.now() + SEVEN_DAYS })
  );
}

/**
 * 获取当前租户 ID
 */
export function getTenantId(): string {
  return tenantId || CURRENT_SUBDOMAIN;
}

// 导出常量
export { TRACKING_ENDPOINT, WIDGET_DISMISSED_KEY };

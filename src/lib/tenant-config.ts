// 租户配置

// API 基础地址
export const API_BASE = 'http://101.42.36.114:5919';

// 默认 subdomain
export const DEFAULT_SUBDOMAIN = 'www';

// 域名到 subdomain 的映射（备案完成后使用）
const DOMAIN_MAPPING: Record<string, string> = {
  'woopc.com': 'www',
  'www.woopc.com': 'www',
  'lianlian.woopc.com': 'lianlian',
  'lianlianwoopc.com': 'lianlian',
  'www.lianlianwoopc.com': 'lianlian',
};

// 构建时设置的 subdomain（通过 sed 替换此值）
export const BUILD_SUBDOMAIN = 'www';

// 从域名获取 subdomain（运行时使用）
function getSubdomainFromDomain(): string {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    // 检查是否在映射中
    if (DOMAIN_MAPPING[hostname]) {
      return DOMAIN_MAPPING[hostname];
    }
    // 检查是否是子域名格式（如 xxx.woopc.com）
    if (hostname.endsWith('.woopc.com')) {
      const subdomain = hostname.replace('.woopc.com', '');
      if (subdomain !== 'www') {
        return subdomain;
      }
    }
  }
  // 返回构建时设置的值
  return BUILD_SUBDOMAIN;
}

// 当前租户 subdomain
export const CURRENT_SUBDOMAIN = getSubdomainFromDomain();

// 租户配置类型
export interface TenantConfig {
  name: string;
  subdomain: string;
  description?: string;
  brandConfig?: {
    primaryColor?: string;
    secondaryColor?: string;
  };
  seoConfig?: {
    title?: string;
    description?: string;
  };
  contactConfig?: {
    phone?: string;
    email?: string;
  };
  features?: {
    coreCapabilities?: CoreCapability[];
    achievements?: Achievement[];
    heroConfig?: HeroConfig;
  };
}

export interface CoreCapability {
  id: string;
  title: string;
  subtitle: string;
  tagline: string;
  description: string;
  highlights: { icon: string; label: string; text: string }[];
  color: string;
}

export interface Achievement {
  value: string;
  label: string;
  icon: string;
}

export interface HeroConfig {
  title: string;
  subtitle: string;
  tagline: string;
  description: string;
  badges: string[];
  stats: { value: string; label: string }[];
  buttons: { text: string; style: string; icon: string }[];
  centerText: string;
  floatingElements: string[];
}

// 从 API 获取租户配置
export async function getTenantConfig(subdomain: string): Promise<TenantConfig | null> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/public/${subdomain}`, {
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error('Failed to fetch tenant config:', error);
    return null;
  }
}

// 获取品牌 CSS 变量
export function getBrandColors(brandConfig?: TenantConfig['brandConfig']) {
  return {
    primary: brandConfig?.primaryColor || '#0ea5e9',
    secondary: brandConfig?.secondaryColor || '#d946ef',
  };
}

// 多租户配置模块

// API 基础地址
export const API_BASE = import.meta.env.API_BASE || 'http://101.42.36.114:5919';

// 默认 subdomain（用于构建时）
export const DEFAULT_SUBDOMAIN = 'www';

/**
 * 从 URL 获取 subdomain
 * 支持以下格式：
 * 1. 子域名：lianlian.woopc.com -> lianlian
 * 2. URL 参数：?subdomain=lianlian -> lianlian
 * 3. 路径参数：/lianlian/ -> lianlian (需要服务器配置)
 */
export function getSubdomain(url: URL): string {
  // 1. 优先检查 URL 参数
  const subdomainParam = url.searchParams.get('subdomain');
  if (subdomainParam) {
    return subdomainParam;
  }

  // 2. 检查子域名（如 lianlian.woopc.com）
  const hostname = url.hostname;

  // 本地开发环境
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return DEFAULT_SUBDOMAIN;
  }

  // IP 地址直接访问
  if (/^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
    return DEFAULT_SUBDOMAIN;
  }

  // 提取子域名（如 lianlian.woopc.com -> lianlian）
  const parts = hostname.split('.');
  if (parts.length >= 3) {
    const subdomain = parts[0];
    // 排除 www
    if (subdomain !== 'www') {
      return subdomain;
    }
  }

  return DEFAULT_SUBDOMAIN;
}

/**
 * Astro 组件使用的函数 - 在服务端获取 subdomain
 */
export function getAstroSubdomain(Astro: any): string {
  if (Astro?.url) {
    return getSubdomain(Astro.url);
  }
  return DEFAULT_SUBDOMAIN;
}

/**
 * 通用 API 获取函数
 */
export async function fetchTenantData<T>(
  subdomain: string,
  resource: string
): Promise<T[]> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/public/${subdomain}/${resource}`, {
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error(`Failed to fetch ${resource}:`, error);
    return [];
  }
}

import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import { ElMessage } from 'element-plus';
import { useUserStore } from '@/store';

/** 统一响应结构 */
export interface ApiResponse<T = any> {
  code: number;
  data: T;
  message: string;
}

/** 创建 Axios 实例 */
const http: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
});

// ---- 请求拦截器 ----
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 注入 token
    const userStore = useUserStore();
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ---- 响应拦截器 ----
http.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { data } = response;

    // 业务状态码判断
    if (data.code !== 200) {
      ElMessage.error(data.message || '请求失败');
      // token 过期处理
      if (data.code === 401) {
        const userStore = useUserStore();
        userStore.logoutAction();
      }
      return Promise.reject(
        new Error(data.message || '请求失败')
      );
    }

    return response;
  },
  (error) => {
    // HTTP 错误处理
    const status = error.response?.status;
    const messages: Record<number, string> = {
      400: '请求参数错误',
      401: '登录已过期，请重新登录',
      403: '没有权限访问',
      404: '请求的资源不存在',
      500: '服务器内部错误',
      502: '网关错误',
      503: '服务不可用',
      504: '网关超时',
    };

    if (status && messages[status]) {
      ElMessage.error(messages[status]);
      if (status === 401) {
        const userStore = useUserStore();
        userStore.logoutAction();
      }
    } else {
      ElMessage.error(error.message || '网络错误');
    }

    return Promise.reject(error);
  }
);

export default http;

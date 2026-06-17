import http, { type ApiResponse } from '@/utils/http';

/**
 * GET 请求
 */
export function get<T = any>(
  url: string,
  params?: Record<string, any>
): Promise<ApiResponse<T>> {
  return http.get(url, { params }).then((res) => res.data);
}

/**
 * POST 请求
 */
export function post<T = any>(
  url: string,
  data?: Record<string, any>
): Promise<ApiResponse<T>> {
  return http.post(url, data).then((res) => res.data);
}

/**
 * PUT 请求
 */
export function put<T = any>(
  url: string,
  data?: Record<string, any>
): Promise<ApiResponse<T>> {
  return http.put(url, data).then((res) => res.data);
}

/**
 * DELETE 请求
 */
export function del<T = any>(
  url: string,
  params?: Record<string, any>
): Promise<ApiResponse<T>> {
  return http
    .delete(url, { params })
    .then((res) => res.data);
}

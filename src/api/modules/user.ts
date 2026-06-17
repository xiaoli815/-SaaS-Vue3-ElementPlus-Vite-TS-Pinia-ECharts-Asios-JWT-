import { post, get } from '../request';

/** 登录请求参数 */
export interface LoginParams {
  username: string;
  password: string;
}

/** 用户信息 */
export interface UserInfo {
  id: number;
  username: string;
  nickname: string;
  avatar: string;
  email: string;
  role: string[];
  createTime: string;
}

/** 登录返回 */
export interface LoginResult {
  accessToken: string;
  refreshToken: string;
}

/** 登录 */
export function login(params: LoginParams) {
  return post<LoginResult>('/auth/login', params);
}

/** 获取用户信息 */
export function getUserInfo() {
  return get<UserInfo>('/auth/userinfo');
}

/** 退出登录 */
export function logout() {
  return post('/auth/logout');
}

import { defineStore } from 'pinia';
import { ref } from 'vue';
import {
  getUserInfo,
  login,
  logout,
  type LoginParams,
  type UserInfo,
} from '@/api/modules/user';
import router from '@/router';

export const useUserStore = defineStore(
  'user',
  () => {
    // ---- 状态 ----
    const token = ref<string>('');
    const userInfo = ref<UserInfo | null>(null);

    // ---- 计算属性 ----
    const isLoggedIn = () => !!token.value;

    // ---- 操作 ----
    /** 登录 */
    async function loginAction(params: LoginParams) {
      const res = await login(params);
      token.value = res.data.accessToken;
      return res;
    }

    /** 获取用户信息 */
    async function getUserInfoAction() {
      const res = await getUserInfo();
      userInfo.value = res.data;
      return res;
    }

    /** 退出登录 */
    async function logoutAction() {
      try {
        await logout();
      } finally {
        resetState();
        router.push('/login');
      }
    }

    /** 重置状态 */
    function resetState() {
      token.value = '';
      userInfo.value = null;
    }

    return {
      token,
      userInfo,
      isLoggedIn,
      loginAction,
      getUserInfoAction,
      logoutAction,
      resetState,
    };
  },
  {
    // 持久化配置
    persist: {
      key: 'user-store',
      storage: localStorage,
      paths: ['token'],
    },
  }
);

<template>
  <div class="layout-container">
    <Sidebar />
    <div
      class="layout-main"
      :class="{ collapsed: appStore.sidebarCollapsed }"
    >
      <div class="layout-header">
        <div class="header-left">
          <el-icon
            class="collapse-icon"
            @click="appStore.toggleSidebar"
          ><Fold
            v-if="!appStore.sidebarCollapsed"
          /><Expand
            v-else
          /></el-icon>
          <el-breadcrumb separator="/"><el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item><el-breadcrumb-item>{{
            route.meta.title
          }}</el-breadcrumb-item></el-breadcrumb>
        </div>
        <div class="header-right">
          <el-dropdown
            trigger="click"
            @command="handleCommand"
          >
            <span class="user-info">{{ userStore.userInfo?.nickname || '管理员'
            }}<el-icon><ArrowDown /></el-icon></span>
            <template #dropdown>
              <el-dropdown-menu><el-dropdown-item command="profile">个人设置</el-dropdown-item><el-dropdown-item command="logout"
                                                                                                             divided
              >退出登录</el-dropdown-item></el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <div class="layout-content"><router-view /></div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useRoute } from 'vue-router'
  import { useUserStore, useAppStore } from '@/store'
  import Sidebar from '@/components/Sidebar/index.vue'

  const route = useRoute()
  const userStore = useUserStore()
  const appStore = useAppStore()

  function handleCommand(cmd: string) {
    if (cmd === 'logout') userStore.logoutAction()
  }
</script>

<style scoped lang="scss">
  .layout-container {
    display: flex;
    height: 100%;
  }

  .layout-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-left: 220px;
    transition: margin-left 0.3s;

    &.collapsed {
      margin-left: 64px;
    }
  }

  .layout-header {
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
    z-index: 1;

    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;

      .collapse-icon {
        font-size: 20px;
        cursor: pointer;
        color: #666;

        &:hover {
          color: var(--el-color-primary);
        }
      }
    }

    .header-right .user-info {
      display: flex;
      align-items: center;
      gap: 4px;
      cursor: pointer;
      color: #333;
    }
  }

  .layout-content {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    background: #f0f2f5;
  }
</style>

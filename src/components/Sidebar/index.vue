<template>
  <el-menu
    :default-active="route.path"
    :collapse="appStore.sidebarCollapsed"
    :collapse-transition="false"
    router
    class="sidebar-menu"
    background-color="#304156"
    text-color="#bfcbd9"
    active-text-color="#409eff"
  >
    <div class="sidebar-logo">
      <img
        src="/vite.svg"
        alt="logo"
        class="logo-img"
      /><span
        v-show="!appStore.sidebarCollapsed"
        class="logo-title"
      >SaaS管理后台</span>
    </div>

    <el-sub-menu index="product">
      <template #title><el-icon><Goods /></el-icon><span>商品管理</span></template>
      <el-menu-item index="/product/list"><span>商品列表</span></el-menu-item>
    </el-sub-menu>

    <el-sub-menu index="order">
      <template #title><el-icon><List /></el-icon><span>订单管理</span></template>
      <el-menu-item index="/order/list"><span>订单列表</span></el-menu-item>
    </el-sub-menu>

    <el-sub-menu index="marketing">
      <template #title><el-icon><Present /></el-icon><span>营销活动</span></template>
      <el-menu-item index="/marketing/seckill"><span>秒杀活动</span></el-menu-item>
      <el-menu-item index="/marketing/group"><span>拼团活动</span></el-menu-item>
      <el-menu-item index="/marketing/coupon"><span>优惠券管理</span></el-menu-item>
      <el-menu-item index="/marketing/full-reduction"><span>满减活动</span></el-menu-item>
      <el-menu-item index="/marketing/distribution"><span>分销配置</span></el-menu-item>
      <el-menu-item index="/marketing/live"><span>直播管理</span></el-menu-item>
    </el-sub-menu>

    <el-sub-menu index="member">
      <template #title><el-icon><User /></el-icon><span>用户管理</span></template>
      <el-menu-item index="/member/list"><span>会员列表</span></el-menu-item>
    </el-sub-menu>

    <el-sub-menu index="report">
      <template #title><el-icon><DataAnalysis /></el-icon><span>数据报表</span></template>
      <el-menu-item index="/report/sales"><span>销量统计</span></el-menu-item>
      <el-menu-item index="/report/traffic"><span>客流统计</span></el-menu-item>
      <el-menu-item index="/report/revenue"><span>营收统计</span></el-menu-item>
      <el-menu-item index="/report/conversion"><span>转化统计</span></el-menu-item>
      <el-menu-item index="/report/inventory"><span>库存统计</span></el-menu-item>
    </el-sub-menu>

    <el-sub-menu index="setting">
      <template #title><el-icon><Setting /></el-icon><span>系统设置</span></template>
      <el-menu-item index="/setting/roles"><span>角色权限</span></el-menu-item>
      <el-menu-item index="/setting/shop"><span>店铺配置</span></el-menu-item>
      <el-menu-item index="/setting/payment"><span>支付配置</span></el-menu-item>
      <el-menu-item index="/setting/page"><span>页面装修</span></el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script setup lang="ts">
  import { useRoute } from 'vue-router';
  import { useAppStore } from '@/store';

  const route = useRoute();
  const appStore = useAppStore();
</script>

<style scoped lang="scss">
  .sidebar-menu {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: 220px;
    overflow-y: auto;
    border-right: none;
    transition: width 0.3s;
    z-index: 9999;

    &:not(.el-menu--collapse) {
      width: 220px;
    }

    &.el-menu--collapse {
      width: 64px;
    }
  }

  .sidebar-logo {
    display: flex;
    align-items: center;
    height: 50px;
    padding: 0 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);

    .logo-img {
      width: 32px;
      height: 32px;
    }

    .logo-title {
      margin-left: 10px;
      font-size: 16px;
      font-weight: bold;
      color: #fff;
      white-space: nowrap;
    }
  }
</style>

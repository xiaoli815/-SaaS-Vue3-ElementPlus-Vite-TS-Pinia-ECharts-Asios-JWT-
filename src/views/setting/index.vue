<template>
  <div class="page-container">
    <h3 style="margin-bottom: 16px">系统设置</h3>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="角色权限"
                   name="roles"
      />
      <el-tab-pane label="店铺配置"
                   name="shop"
      />
      <el-tab-pane label="支付配置"
                   name="payment"
      />
      <el-tab-pane label="页面装修"
                   name="page"
      />
    </el-tabs>

    <el-card style="margin-top: 16px"
             v-loading="loading"
    >
      <!-- 角色权限 -->
      <div v-if="activeTab === 'roles'">
        <el-table :data="roles"
                  border
        >
          <el-table-column
            prop="name"
            label="角色"
            width="120"
          /><el-table-column
            prop="description"
            label="描述"
            min-width="160"
          />
          <el-table-column label="权限"
                           min-width="300"
          ><template #default="{ row }"><el-checkbox-group
            v-model="row.permissions"
            size="small"
          ><el-checkbox
            v-for="p in allPerms"
            :key="p"
            :label="p"
            :value="
              p
            "
          /></el-checkbox-group></template></el-table-column>
          <el-table-column label="操作"
                           width="100"
          ><template #default="{ row }"><el-button
            type="primary"
            link
            @click="handleSaveRoles(row as RoleItem)"
          >保存</el-button></template></el-table-column>
        </el-table>
      </div>

      <!-- 店铺配置 -->
      <div v-if="activeTab === 'shop'">
        <el-form :model="shopForm"
                 label-width="100px"
        >
          <el-form-item label="店铺名称"><el-input v-model="shopForm.name"/></el-form-item>
          <el-form-item label="店铺Logo"><el-input v-model="shopForm.logo"/></el-form-item>
          <el-form-item label="联系电话"><el-input v-model="shopForm.phone"/></el-form-item>
          <el-form-item label="店铺地址"><el-input v-model="shopForm.address"/></el-form-item>
          <el-form-item label="店铺描述"><el-input
            v-model="shopForm.description"
            type="textarea"
            :rows="3"
          /></el-form-item>
          <el-form-item label="公告"><el-input
            v-model="shopForm.notice"
            type="textarea"
            :rows="2"
          /></el-form-item>
          <el-form-item><el-button
            type="primary"
            @click="handleSaveShop"
          >保存</el-button></el-form-item>
        </el-form>
      </div>

      <!-- 支付配置 -->
      <div v-if="activeTab === 'payment'">
        <el-form :model="payForm"
                 label-width="120px"
        >
          <el-divider content-position="left">微信支付</el-divider>
          <el-form-item label="启用"><el-switch v-model="payForm.wechat.enabled"/></el-form-item>
          <el-form-item label="AppID"><el-input v-model="payForm.wechat.appId"/></el-form-item>
          <el-form-item label="商户号"><el-input v-model="payForm.wechat.mchId"/></el-form-item>
          <el-form-item label="API密钥"><el-input
            v-model="payForm.wechat.apiKey"
            type="password"
            show-password
          /></el-form-item>
          <el-divider content-position="left">支付宝</el-divider>
          <el-form-item label="启用"><el-switch v-model="payForm.alipay.enabled"/></el-form-item>
          <el-form-item label="AppID"><el-input v-model="payForm.alipay.appId"/></el-form-item>
          <el-form-item label="私钥"><el-input
            v-model="payForm.alipay.privateKey"
            type="textarea"
            :rows="3"
          /></el-form-item>
          <el-form-item><el-button
            type="primary"
            @click="handleSavePayment"
          >保存</el-button></el-form-item>
        </el-form>
      </div>

      <!-- 页面装修 -->
      <div v-if="activeTab === 'page'">
        <div
          v-for="(comp, idx) in pageComponents"
          :key="comp.id"
          style="
            border: 1px dashed #dcdfe6;
            border-radius: 6px;
            padding: 12px;
            margin-bottom: 12px;
          "
        >
          <div
            style="
              display: flex;
              justify-content: space-between;
              margin-bottom: 8px;
            "
          >
            <span><el-tag size="small">{{ comp.type }}</el-tag>
              {{ comp.config?.title || comp.id }}</span>
            <el-button
              type="danger"
              size="small"
              @click="pageComponents.splice(idx, 1)"
            >删除</el-button>
          </div>
          <!-- Banner -->
          <div v-if="comp.type === 'banner'">
            <el-input
              v-model="comp.config.images[0]"
              placeholder="图片1 URL"
              size="small"
            /><el-input
              v-model="comp.config.images[1]"
              placeholder="图片2 URL"
              size="small"
              style="margin-top: 4px"
            />
            <span style="font-size: 12px; color: #999">轮播间隔(ms):</span><el-input-number
              v-model="comp.config.duration"
              :min="1000"
              size="small"
            />
          </div>
          <!-- Nav -->
          <div v-if="comp.type === 'nav'">
            <span>列数:</span><el-input-number
              v-model="comp.config.columns"
              :min="1"
              :max="5"
              size="small"
            />
          </div>
          <!-- Goods -->
          <div v-if="comp.type === 'goods'">
            <el-input
              v-model="comp.config.title"
              size="small"
              placeholder="标题"
            />
            <span>商品ID:</span><el-input
              v-model="comp.config.productIdsStr"
              size="small"
              placeholder="逗号分隔"
            />
          </div>
          <!-- Coupon -->
          <div v-if="comp.type === 'coupon'">
            <el-input
              v-model="comp.config.title"
              size="small"
              placeholder="标题"
            />
            <span>优惠券ID:</span><el-input
              v-model="comp.config.couponIdsStr"
              size="small"
              placeholder="逗号分隔"
            />
          </div>
        </div>
        <el-dropdown @command="addPageComp">
          <el-button type="primary"
                     size="small"
          >+ 添加组件</el-button>
          <template #dropdown><el-dropdown-menu><el-dropdown-item command="banner">Banner轮播</el-dropdown-item><el-dropdown-item command="nav">导航</el-dropdown-item><el-dropdown-item command="goods">商品推荐</el-dropdown-item><el-dropdown-item command="coupon">优惠券</el-dropdown-item></el-dropdown-menu></template>
        </el-dropdown>
        <div style="margin-top: 16px">
          <el-button type="primary"
                     @click="handleSavePage"
          >保存页面配置</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, watch, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { ElMessage } from 'element-plus';
  import {
    getRoles,
    updateRole,
    getShopInfo,
    updateShopInfo,
    getPaymentConfig,
    updatePaymentConfig,
    getPageConfig,
    updatePageConfig,
    type RoleItem,
    type ShopInfo,
    type PaymentConfig,
    type PageBlock,
  } from '@/api/modules/setting';

  const route = useRoute();
  const activeTab = ref((route.params.tab as string) || 'roles');
  const loading = ref(false);

  watch(() => route.params.tab,(val) => {
      if (val) activeTab.value = val as string;
    }
  );

  // 角色
  const roles = ref<RoleItem[]>([]);
  const allPerms = [
    'product:read',
    'product:write',
    'order:read',
    'order:write',
    'order:deliver',
    'marketing:read',
    'marketing:write',
    'member:read',
    'member:write',
    'report:read',
    'setting:read',
    'setting:write',
  ];
  // 店铺
  const shopForm = reactive<ShopInfo>({
    id: 0,
    name: '',
    logo: '',
    phone: '',
    address: '',
    description: '',
    notice: '',
  });
  // 支付
  const payForm = reactive<PaymentConfig>({
    wechat: {
      enabled: false,
      appId: '',
      mchId: '',
      apiKey: '',
    },
    alipay: { enabled: false, appId: '', privateKey: '' },
  });
  // 页面
  interface PageBlockForm extends PageBlock {
    config: Record<string, any>;
  }
  const pageComponents = ref<PageBlockForm[]>([]);

  async function fetchData() {
    loading.value = true;
    try {
      roles.value = (await getRoles()).data;
      Object.assign(shopForm, (await getShopInfo()).data);
      Object.assign(
        payForm,
        (await getPaymentConfig()).data
      );
      const pageData = (await getPageConfig()).data;
      pageComponents.value = (pageData.homePage || []).map(
        (c: PageBlockForm) => ({
          ...c,
          config: {
            ...c.config,
            productIdsStr: (c.config.productIds || []).join(
              ','
            ),
            couponIdsStr: (c.config.couponIds || []).join(
              ','
            ),
          },
        })
      );
    } finally {
      loading.value = false;
    }
  }

  async function handleSaveRoles(row: RoleItem) {
    await updateRole(row.id, row.permissions);
    ElMessage.success('保存成功');
  }
  async function handleSaveShop() {
    await updateShopInfo(shopForm);
    ElMessage.success('保存成功');
  }
  async function handleSavePayment() {
    await updatePaymentConfig(payForm);
    ElMessage.success('保存成功');
  }

  function addPageComp(type: string) {
    const defaults: Record<string, Record<string, unknown>> = {
      banner: { images: ['', ''], duration: 3000 },
      nav: {
        columns: 5,
        items: [{ name: '按钮1', icon: 'Star' }],
      },
      goods: {
        title: '热销推荐',
        layout: 'grid',
        columns: 2,
        productIdsStr: '',
      },
      coupon: { title: '领券中心', couponIdsStr: '' },
    };
    pageComponents.value.push({
      id: type + Date.now(),
      type,
      config: defaults[type],
    });
  }

  async function handleSavePage() {
    const homePage = pageComponents.value.map((c: PageBlockForm) => ({
      ...c,
      config: {
        ...c.config,
        productIds:
          c.type === 'goods'
            ? c.config.productIdsStr
                .split(',')
                .map(Number)
                .filter(Boolean)
            : c.config.productIds,
        couponIds:
          c.type === 'coupon'
            ? c.config.couponIdsStr
                .split(',')
                .map(Number)
                .filter(Boolean)
            : c.config.couponIds,
        productIdsStr: undefined,
        couponIdsStr: undefined,
      },
    }));
    await updatePageConfig({ homePage });
    ElMessage.success('页面配置已保存');
  }

  onMounted(fetchData);
</script>

<style scoped lang="scss">
  .page-container {
    max-width: 1200px;
  }
</style>

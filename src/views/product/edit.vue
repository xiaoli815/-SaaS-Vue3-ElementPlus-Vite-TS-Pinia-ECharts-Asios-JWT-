<template>
  <div class="page-container">
    <el-card>
      <template #header><span>{{
        isEdit ? '编辑商品' : '新增商品'
      }}</span></template>
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="90px"
        size="default"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="商品名称"
                          prop="name"
            ><el-input v-model="form.name"/></el-form-item>
            <el-form-item label="商品标题"><el-input v-model="form.title"/></el-form-item>
            <el-form-item
              label="商品分类"
              prop="categoryId"
            >
              <el-select
                v-model="form.categoryId"
                @change="onCategoryChange"
              ><el-option
                v-for="c in categories"
                :key="c.id"
                :label="c.name"
                :value="c.id"
              /></el-select>
            </el-form-item>
            <el-form-item label="品牌"><el-input v-model="form.brand"/></el-form-item>
            <el-form-item label="售价"
                          prop="price"
            ><el-input-number
              v-model="form.price"
              :min="0"
              :precision="2"
            /></el-form-item>
            <el-form-item label="市场价"><el-input-number
              v-model="form.marketPrice"
              :min="0"
              :precision="2"
            /></el-form-item>
            <el-form-item label="成本价"><el-input-number
              v-model="form.costPrice"
              :min="0"
              :precision="2"
            /></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="封面图"><el-input
              v-model="form.cover"
              placeholder="图片URL"
            /><el-image
              v-if="form.cover"
              :src="form.cover"
              style="
                  margin-top: 8px;
                  width: 120px;
                  height: 120px;
                "
            /></el-form-item>
            <el-form-item label="商品描述"><el-input
              v-model="form.description"
              type="textarea"
              :rows="4"
            /></el-form-item>
          </el-col>
        </el-row>

        <!-- SKU 编辑 -->
        <el-divider content-position="left">规格SKU</el-divider>
        <el-button
          type="primary"
          size="small"
          @click="addSku"
          style="margin-bottom: 12px"
        >+ 添加规格</el-button>
        <el-table :data="form.skuList"
                  border
                  size="small"
        >
          <el-table-column label="规格名称"><template #default="{ row }"><el-input
            v-model="row.specs"
            placeholder="如：黑色/M"
            size="small"
          /></template></el-table-column>
          <el-table-column label="价格"
                           width="140"
          ><template #default="{ row }"><el-input-number
            v-model="row.price"
            :min="0"
            :precision="2"
            size="small"
          /></template></el-table-column>
          <el-table-column label="库存"
                           width="120"
          ><template #default="{ row }"><el-input-number
            v-model="row.stock"
            :min="0"
            size="small"
          /></template></el-table-column>
          <el-table-column label="SKU编码"
                           width="160"
          ><template #default="{ row }"><el-input
            v-model="row.skuCode"
            size="small"
          /></template></el-table-column>
          <el-table-column label="操作"
                           width="80"
          ><template #default="{ $index }"><el-button
            type="danger"
            size="small"
            @click="form.skuList.splice($index, 1)"
          >删除</el-button></template></el-table-column>
        </el-table>

        <div style="margin-top: 24px; text-align: center">
          <el-button
            type="primary"
            :loading="saving"
            @click="handleSave"
          >保存</el-button>
          <el-button @click="$router.back()">取消</el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted, computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { ElMessage } from 'element-plus';
  import {
    getProductDetail,
    createProduct,
    updateProduct,
    getCategories,
    ProductForm,
    ProductItem,
  } from '@/api/modules/product';

  const route = useRoute();
  const router = useRouter();
  const isEdit = computed(() => !!route.params.id);
  const categories = ref<{ id: number; name: string }[]>(
    []
  );
  const saving = ref(false);

  const form = reactive<ProductForm>({
    name: '',
    title: '',
    categoryId: 0,
    categoryName: '',
    brand: '',
    price: 0,
    marketPrice: 0,
    costPrice: 0,
    cover: '',
    description: '',
    skuList: [],
  });

  const rules = {
    name: [{ required: true, message: '请输入商品名称' }],
    categoryId: [{ required: true, message: '请选择分类' }],
    price: [{ required: true, message: '请输入售价' }],
  };

  function onCategoryChange(val: number) {
    const found = categories.value.find(
      (c) => c.id === val
    );
    form.categoryName = found?.name || '';
  }
  function addSku() {
    form.skuList.push({
      id: 0,
      specs: '',
      price: 0,
      stock: 0,
      skuCode: '',
    });
  }

  async function handleSave() {
    saving.value = true;
    try {
      if (isEdit.value) {
        await updateProduct(Number(route.params.id), form);
        ElMessage.success('更新成功');
      } else {
        await createProduct(form);
        ElMessage.success('新增成功');
      }
      router.push('/product/list');
    } finally {
      saving.value = false;
    }
  }

  onMounted(async () => {
    const res = await getCategories();
    categories.value = res.data;
    if (isEdit.value) {
      const d = await getProductDetail(
        Number(route.params.id)
      );
      Object.assign(form, d.data);
    }
  });
</script>

<style scoped lang="scss">
  .page-container {
    max-width: 1200px;
  }
</style>

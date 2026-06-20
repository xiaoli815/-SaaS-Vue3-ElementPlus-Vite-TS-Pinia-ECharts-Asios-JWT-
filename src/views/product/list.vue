<template>
  <div class="page-container">
    <el-card>
      <div class="search-bar">
        <el-input
          v-model="query.keyword"
          placeholder="商品名称/品牌"
          clearable
          style="width: 220px"
          @keyup.enter="fetchList"
        />
        <el-select
          v-model="query.categoryId"
          placeholder="商品分类"
          clearable
          style="width: 160px"
          @change="fetchList"
        >
          <el-option
            v-for="c in categories"
            :key="c.id"
            :label="c.name"
            :value="c.id"
          />
        </el-select>
        <el-select
          v-model="query.isListed"
          placeholder="上下架"
          clearable
          style="width: 120px"
          @change="fetchList"
        >
          <el-option
            label="已上架"
            value="true"
          /><el-option label="已下架"
                       value="false"
          />
        </el-select>
        <el-button type="primary"
                   @click="fetchList"
        >查询</el-button>
        <el-button
          type="success"
          @click="$router.push('/product/edit')"
        >新增商品</el-button>
      </div>
    </el-card>

    <el-card style="margin-top: 16px">
      <el-table
        :data="list"
        v-loading="loading"
        border
        stripe
      >
        <el-table-column prop="id"
                         label="ID"
                         width="70"
        />
        <el-table-column label="商品图"
                         width="80"
        ><template #default="{ row }"><el-image
          :src="row.cover"
          style="width: 50px; height: 50px"
        /></template></el-table-column>
        <el-table-column
          prop="name"
          label="商品名称"
          min-width="180"
        />
        <el-table-column
          prop="categoryName"
          label="分类"
          width="100"
        />
        <el-table-column
          prop="brand"
          label="品牌"
          width="100"
        />
        <el-table-column label="价格"
                         width="110"
        ><template #default="{ row }">¥{{ row.price }}</template></el-table-column>
        <el-table-column label="库存"
                         width="80"
        ><template #default="{ row }">{{
          row.stock
        }}</template></el-table-column>
        <el-table-column label="销量"
                         width="80"
        ><template #default="{ row }">{{
          row.sales
        }}</template></el-table-column>
        <el-table-column label="状态"
                         width="90"
        ><template #default="{ row }"><el-tag
          :type="row.isListed ? 'success' : 'info'"
          size="small"
        >{{
          row.isListed ? '已上架' : '已下架'
        }}</el-tag></template></el-table-column>
        <el-table-column
          label="操作"
          width="220"
          fixed="right"
        >
          <template #default="{ row }">
            <el-button
              type="primary"
              link
              @click="
                $router.push(`/product/edit/${row.id}`)
              "
            >编辑</el-button>
            <el-button
              :type="row.isListed ? 'warning' : 'success'"
              link
              @click="handleToggle(row as ProductItem)"
            >
              >{{
                row.isListed ? '下架' : '上架'
              }}</el-button>
            <el-popconfirm
              title="确认删除？"
              @confirm="handleDelete(row.id)"
            ><template #reference><el-button type="danger"
                                             link
            >删除</el-button></template></el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          v-model:current-page="query.page"
          v-model:page-size="query.pageSize"
          :total="total"
          layout="total,prev,pager,next"
          @change="fetchList"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue';
  import { ElMessage } from 'element-plus';
  import {
    getProductList,
    getCategories,
    toggleListing,
    deleteProduct,
    type ProductItem,
  } from '@/api/modules/product';

  const list = ref<ProductItem[]>([]);
  const categories = ref<{ id: number; name: string }[]>(
    []
  );
  const total = ref(0);
  const loading = ref(false);
  const query = reactive({
    page: 1,
    pageSize: 10,
    keyword: '',
    categoryId: undefined as number | undefined,
    isListed: '',
  });

  async function fetchList() {
    loading.value = true;
    try {
      const res = await getProductList(query);
      list.value = res.data.list;
      total.value = res.data.total;
    } catch {
      // 全局拦截器已弹出错误提示
    } finally {
      loading.value = false;
    }
  }

  async function handleToggle(row: ProductItem) {
    await toggleListing(row.id, !row.isListed);
    ElMessage.success(
      row.isListed ? '下架成功' : '上架成功'
    );
    fetchList();
  }
  async function handleDelete(id: number) {
    await deleteProduct(id);
    ElMessage.success('删除成功');
    fetchList();
  }

  onMounted(async () => {
    const res = await getCategories();
    categories.value = res.data;
    fetchList();
  });
</script>

<style scoped lang="scss">
  .page-container {
    .search-bar {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      align-items: center;
    }

    .pagination {
      margin-top: 16px;
      display: flex;
      justify-content: flex-end;
    }
  }
</style>

<template>
  <div class="page-container">
    <el-card><div class="search-bar">
      <el-input
        v-model="keyword"
        placeholder="直播标题/主播名"
        clearable
        style="width: 200px"
        @keyup.enter="fetch"
      /><el-button type="primary"
                   @click="fetch"
      >查询</el-button><el-button type="success"
                                @click="showDlg('add')"
      >新增直播</el-button>
    </div></el-card>
    <el-card style="margin-top: 16px">
      <el-table :data="list"
                border
                stripe
      >
        <el-table-column
          prop="id"
          label="ID"
          width="70"
        /><el-table-column
          prop="roomId"
          label="直播间ID"
          width="100"
        /><el-table-column
          prop="title"
          label="直播标题"
          min-width="200"
        />
        <el-table-column
          prop="anchor"
          label="主播"
          width="100"
        />
        <el-table-column label="绑定商品"
                         width="100"
        ><template #default="{ row }">{{ row.productIds?.length || 0 }}个</template></el-table-column>
        <el-table-column label="直播时间"
                         min-width="300"
        ><template #default="{ row }">{{ row.startTime }} ~
          {{ row.endTime }}</template></el-table-column>
        <el-table-column label="状态"
                         width="90"
        ><template #default="{ row }"><el-tag
          :type="
            row.status === 1
              ? 'success'
              : row.status === 0
                ? 'warning'
                : 'info'
          "
          size="small"
        >{{ row.statusText }}</el-tag></template></el-table-column>
        <el-table-column label="操作"
                         width="150"
        ><template #default="{ row }"><el-button
          type="primary"
          link
          @click="showDlg('edit', row)"
        >编辑</el-button><el-popconfirm
          title="确认删除？"
          @confirm="handleDelete(row.id)"
        ><template #reference><el-button type="danger"
                                         link
        >删除</el-button></template></el-popconfirm></template></el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          v-model:current-page="page"
          v-model:page-size="pageSize"
          :total="total"
          layout="total,prev,pager,next"
          @change="fetch"
        />
      </div>
    </el-card>
    <el-dialog
      :title="dlgTitle"
      v-model="dlgVisible"
      width="500px"
    >
      <el-form :model="form"
               label-width="90px"
      >
        <el-form-item label="直播标题"><el-input v-model="form.title" /></el-form-item><el-form-item label="直播间ID"><el-input v-model="form.roomId"/></el-form-item>
        <el-form-item label="主播名"><el-input v-model="form.anchor" /></el-form-item><el-form-item label="封面图"><el-input v-model="form.cover"/></el-form-item>
        <el-form-item label="商品ID"><el-input
          v-model="form.productIdsStr"
          placeholder="逗号分隔，如 2,5"
        /></el-form-item>
        <el-form-item label="开始时间"><el-date-picker
          v-model="form.startTime"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
        /></el-form-item>
        <el-form-item label="结束时间"><el-date-picker
          v-model="form.endTime"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
        /></el-form-item>
      </el-form>
      <template #footer><el-button @click="dlgVisible = false">取消</el-button><el-button type="primary"
                                                                                        @click="handleSave"
      >保存</el-button></template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue'
  import { ElMessage } from 'element-plus'
  import {
    getLiveList,
    createLive,
    updateLive,
    deleteLive,
    type LiveActivity,
    type LiveForm,
  } from '@/api/modules/marketing'

  const list = ref<LiveActivity[]>([])
  const total = ref(0)
  const page = ref(1)
  const pageSize = ref(10)
  const keyword = ref('')
  const dlgVisible = ref(false)
  const editId = ref<number | null>(null)
  const dlgTitle = ref('新增直播')
  const form = reactive<LiveForm>({
    title: '',
    roomId: '',
    anchor: '',
    cover: '',
    productIdsStr: '',
    startTime: '',
    endTime: '',
  })

  async function fetch() {
    try {
      const res = await getLiveList({
        page: page.value,
        pageSize: pageSize.value,
        keyword: keyword.value,
      })
      list.value = res.data.list
      total.value = res.data.total
    } catch {
      // 全局拦截器已弹出错误提示
    }
  }
  function showDlg(type: string, row?: any) {
    if (type === 'add') {
      Object.assign(form, {
        title: '',
        roomId: '',
        anchor: '',
        cover: '',
        productIdsStr: '',
        startTime: '',
        endTime: '',
      })
      editId.value = null
      dlgTitle.value = '新增直播'
    } else {
      const r = {
        ...row,
        productIdsStr: (row.productIds || []).join(','),
      }
      editId.value = row.id
      dlgTitle.value = '编辑直播'
      Object.assign(form, r)
    }
    dlgVisible.value = true
  }
  async function handleSave() {
    try {
      const data = {
        ...form,
        productIds: form.productIdsStr
          .split(',')
          .map((s: string) => Number(s.trim()))
          .filter(Boolean),
      }
      if (editId.value) {
        await updateLive(editId.value, data)
        ElMessage.success('更新成功')
      } else {
        await createLive(data)
        ElMessage.success('创建成功')
      }
      dlgVisible.value = false
      fetch()
    } catch {
      // 全局拦截器已弹出错误提示
    }
  }
  async function handleDelete(id: number) {
    try {
      await deleteLive(id)
      ElMessage.success('删除成功')
      fetch()
    } catch {
      // 全局拦截器已弹出错误提示
    }
  }
  onMounted(fetch)
</script>

<style scoped lang="scss">
  .page-container {
    .search-bar {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .pagination {
      margin-top: 16px;
      display: flex;
      justify-content: flex-end;
    }
  }
</style>

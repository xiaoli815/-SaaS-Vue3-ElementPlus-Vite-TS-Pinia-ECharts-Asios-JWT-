<template>
  <div class="page-container">
    <el-card>
      <div class="search-bar">
        <el-input
          v-model="query.keyword"
          placeholder="昵称/手机号"
          clearable
          style="width: 200px"
          @keyup.enter="fetch"
        />
        <el-select
          v-model="query.level"
          placeholder="会员等级"
          clearable
          style="width: 140px"
          @change="fetch"
        >
          <el-option
            v-for="lv in levels"
            :key="lv.id"
            :label="lv.name"
            :value="lv.id"
          />
        </el-select>
        <el-select
          v-model="query.isBlacklisted"
          placeholder="黑名单"
          clearable
          style="width: 120px"
          @change="fetch"
        >
          <el-option
            label="正常"
            :value="'false'"
          /><el-option label="已拉黑"
                       :value="'true'"
          />
        </el-select>
        <el-button type="primary"
                   @click="fetch"
        >查询</el-button>
      </div>
    </el-card>
    <el-card style="margin-top: 16px">
      <el-tabs v-model="activeTab"
               @tab-change="fetch"
      >
        <el-tab-pane label="会员列表"
                     name="list"
        />
        <el-tab-pane label="等级配置"
                     name="levels"
        />
        <el-tab-pane label="标签管理"
                     name="tags"
        />
      </el-tabs>

      <!-- 会员列表 -->
      <div v-if="activeTab === 'list'">
        <el-table
          :data="list"
          border
          stripe
          v-loading="loading"
        >
          <el-table-column
            prop="id"
            label="ID"
            width="60"
          /><el-table-column
            prop="nickname"
            label="昵称"
            width="100"
          />
          <el-table-column
            prop="phone"
            label="手机号"
            width="130"
          /><el-table-column
            prop="email"
            label="邮箱"
            min-width="160"
          />
          <el-table-column label="等级"
                           width="110"
          ><template #default="{ row }"><el-tag size="small">{{
            row.levelName
          }}</el-tag></template></el-table-column>
          <el-table-column label="累计消费"
                           width="110"
          ><template #default="{ row }">¥{{ row.totalSpent }}</template></el-table-column>
          <el-table-column
            prop="orderCount"
            label="订单数"
            width="80"
          />
          <el-table-column label="状态"
                           width="90"
          ><template #default="{ row }"><el-tag
            :type="
              row.isBlacklisted ? 'danger' : 'success'
            "
            size="small"
          >{{
            row.isBlacklisted ? '已拉黑' : '正常'
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
                  $router.push(`/member/detail/${row.id}`)
                "
              >详情</el-button>
              <el-button
                type="warning"
                link
                @click="handleLevelChange(row as MemberItem)"
              >改等级</el-button>
              <el-button
                :type="
                  row.isBlacklisted ? 'success' : 'danger'
                "
                link
                @click="handleBlacklist(row as MemberItem)"
              >{{
                row.isBlacklisted ? '恢复' : '拉黑'
              }}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
            v-model:current-page="query.page"
            v-model:page-size="query.pageSize"
            :total="total"
            layout="total,prev,pager,next"
            @change="fetch"
          />
        </div>
      </div>

      <!-- 等级配置 -->
      <div v-if="activeTab === 'levels'">
        <el-table :data="levels"
                  border
        >
          <el-table-column
            prop="id"
            label="ID"
            width="60"
          /><el-table-column
            prop="name"
            label="等级名称"
            width="120"
          />
          <el-table-column label="折扣"
                           width="100"
          ><template #default="{ row }">{{ row.discount }}%</template></el-table-column>
          <el-table-column label="累计消费门槛"
                           width="150"
          ><template #default="{ row }">¥{{ row.minSpent }}</template></el-table-column>
          <el-table-column label="操作"><template #default="{ row }"><el-button
            type="primary"
            link
            @click="editLevel(row as LevelConfig)"
          >编辑</el-button></template></el-table-column>
        </el-table>
      </div>

      <!-- 标签 -->
      <div v-if="activeTab === 'tags'">
        <el-button
          type="primary"
          size="small"
          @click="showTagDlg = true"
          style="margin-bottom: 12px"
        >+ 新建标签</el-button>
        <el-table :data="tags"
                  border
        >
          <el-table-column
            prop="id"
            label="ID"
            width="60"
          /><el-table-column
            prop="name"
            label="标签名"
            width="140"
          />
          <el-table-column label="颜色"
                           width="100"
          ><template #default="{ row }"><el-tag :color="row.color"
                                                size="small"
          >{{
            row.name
          }}</el-tag></template></el-table-column>
          <el-table-column
            prop="memberCount"
            label="会员数"
            width="80"
          />
          <el-table-column label="操作"><template #default="{ row }"><el-popconfirm
            title="确认删除？"
            @confirm="handleDeleteTag(row.id)"
          ><template #reference><el-button type="danger"
                                           link
          >删除</el-button></template></el-popconfirm></template></el-table-column>
        </el-table>
      </div>
    </el-card>

    <!-- 改等级弹窗 -->
    <el-dialog
      title="修改会员等级"
      v-model="levelDlgVisible"
      width="360px"
    >
      <el-select
        v-model="changeLevelId"
        placeholder="选择新等级"
      ><el-option
        v-for="lv in levels"
        :key="lv.id"
        :label="lv.name"
        :value="lv.id"
      /></el-select>
      <template #footer><el-button @click="levelDlgVisible = false">取消</el-button><el-button
        type="primary"
        @click="confirmLevelChange"
      >确定</el-button></template>
    </el-dialog>

    <!-- 编辑等级配置弹窗 -->
    <el-dialog
      title="编辑等级配置"
      v-model="levelEditVisible"
      width="440px"
    >
      <el-form :model="levelEditForm"
               label-width="120px"
      >
        <el-form-item label="等级名称"><el-input v-model="levelEditForm.name"/></el-form-item>
        <el-form-item label="折扣(%)"><el-input-number
          v-model="levelEditForm.discount"
          :min="1"
          :max="100"
        /></el-form-item>
        <el-form-item label="累计消费门槛"><el-input-number
          v-model="levelEditForm.minSpent"
          :min="0"
        /></el-form-item>
      </el-form>
      <template #footer><el-button @click="levelEditVisible = false">取消</el-button><el-button type="primary"
                                                                                              @click="confirmLevelEdit"
      >保存</el-button></template>
    </el-dialog>

    <!-- 新增标签弹窗 -->
    <el-dialog
      title="新建标签"
      v-model="showTagDlg"
      width="380px"
    >
      <el-form :model="tagForm"
               label-width="80px"
      >
        <el-form-item label="标签名称"><el-input v-model="tagForm.name"/></el-form-item>
        <el-form-item label="颜色"><el-color-picker v-model="tagForm.color"/></el-form-item>
      </el-form>
      <template #footer><el-button @click="showTagDlg = false">取消</el-button><el-button type="primary"
                                                                                        @click="handleCreateTag"
      >创建</el-button></template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue';
  import { ElMessage } from 'element-plus';
  import {
    getMemberList,
    getLevelConfigs,
    getTags,
    updateMemberLevel,
    updateLevelConfig,
    createTag,
    deleteTag,
    toggleBlacklist,
    type MemberItem,
    type LevelConfig,
    type TagItem,
    type MemberQuery,
  } from '@/api/modules/member';

  const list = ref<MemberItem[]>([]);
  const total = ref(0);
  const loading = ref(false);
  const levels = ref<LevelConfig[]>([]);
  const tags = ref<TagItem[]>([]);
  const activeTab = ref('list');
  const query = reactive<MemberQuery>({ });

  // 改等级
  const levelDlgVisible = ref(false);
  const changeLevelId = ref(0);
  const currentMemberId = ref(0);
  // 编辑等级配置
  const levelEditVisible = ref(false);
  const levelEditForm = reactive<LevelConfig>({
    id: 0,
    name: '',
    minSpent: 0,
    discount: 0,
    icon: '',
    color: '',
  });
  // 标签
  const showTagDlg = ref(false);
  const tagForm = reactive({ name: '', color: '#409eff' });

  async function fetch() {
    loading.value = true;
    try {
      const res = await getMemberList(query);
      list.value = res.data.list;
      total.value = res.data.total;
    } finally {
      loading.value = false;
    }
  }
  async function fetchConfigs() {
    [levels.value, tags.value] = [
      (await getLevelConfigs()).data,
      (await getTags()).data,
    ];
  }

  function handleLevelChange(row: MemberItem) {
    currentMemberId.value = row.id;
    changeLevelId.value = row.level;
    levelDlgVisible.value = true;
  }
  async function confirmLevelChange() {
    await updateMemberLevel(
      currentMemberId.value,
      changeLevelId.value
    );
    ElMessage.success('等级修改成功');
    levelDlgVisible.value = false;
    fetch();
  }
  function handleBlacklist(row: MemberItem) {
    toggleBlacklist(row.id, !row.isBlacklisted).then(() => {
      ElMessage.success(
        row.isBlacklisted ? '已恢复' : '已拉黑'
      );
      fetch();
    });
  }

  function editLevel(row: LevelConfig) {
    Object.assign(levelEditForm, { ...row });
    levelEditVisible.value = true;
  }
  async function confirmLevelEdit() {
    await updateLevelConfig(
      levelEditForm.id,
      levelEditForm
    );
    ElMessage.success('保存成功');
    levelEditVisible.value = false;
    fetchConfigs();
  }
  async function handleCreateTag() {
    await createTag(tagForm);
    ElMessage.success('创建成功');
    showTagDlg.value = false;
    fetchConfigs();
  }
  async function handleDeleteTag(id: number) {
    await deleteTag(id);
    ElMessage.success('删除成功');
    fetchConfigs();
  }

  onMounted(() => {
    fetch();
    fetchConfigs();
  });
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

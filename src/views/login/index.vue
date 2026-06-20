<template>
  <div class="login-container">
    <el-card class="login-card">
      <h2 class="login-title">电商SaaS后台管理系统</h2>
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="0"
        size="large"
      >
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            placeholder="请输入用户名"
            prefix-icon="User"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            prefix-icon="Lock"
            show-password
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            class="login-btn"
            @click="handleLogin"
          >登 录</el-button>
        </el-form-item>
      </el-form>
      <p class="tips">测试账号：admin / 123456</p>
    </el-card>
  </div>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import type {
    FormInstance,
    FormRules,
  } from 'element-plus'
  import { useUserStore } from '@/store'

  const router = useRouter()
  const userStore = useUserStore()
  const formRef = ref<FormInstance>()
  const loading = ref(false)
  const form = reactive({
    username: 'admin',
    password: '123456',
  })
  const rules: FormRules = {
    username: [
      {
        required: true,
        message: '请输入用户名',
        trigger: 'blur',
      },
    ],
    password: [
      {
        required: true,
        message: '请输入密码',
        trigger: 'blur',
      },
    ],
  }
  async function handleLogin() {
    const valid = await formRef.value
      ?.validate()
      .catch(() => false)
    if (!valid) return
    loading.value = true
    try {
      await userStore.loginAction(form)
      await userStore.getUserInfoAction()
      router.push('/')
    } catch {
      // 全局拦截器已弹出错误提示
    } finally {
      loading.value = false
    }
  }
</script>

<style scoped lang="scss">
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: linear-gradient(
      135deg,
      #667eea 0%,
      #764ba2 100%
    );
  }

  .login-card {
    width: 420px;
    padding: 20px 0;

    .login-title {
      text-align: center;
      font-size: 22px;
      color: #333;
      margin-bottom: 30px;
    }

    .login-btn {
      width: 100%;
    }
  }

  .tips {
    text-align: center;
    color: #999;
    font-size: 13px;
  }
</style>

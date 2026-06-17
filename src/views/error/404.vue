<template>
  <div class="error-404">
    <div class="error-content">
      <h1>404</h1>
      <p>抱歉，您访问的页面不存在</p>
      <el-button type="primary" 
                 @click="$router.push('/')"
      >返回首页</el-button>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
<style scoped lang="scss">
.error-404 {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
}

h1 {
  font-size: 80px;
  color: var(--el-color-primary);
}

p {
  font-size: 18px;
  color: #666;
  margin: 20px 0 30px;
}
</style>
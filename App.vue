
<template>
  <div id='container'>
    <h1>{{initData}}</h1>
    <div class='header'>
      我是header
    </div>
    <Dashboard/>
  </div>
</template>

<script>
import Dashboard from '@/dashboard'

export default {
  data() {
    return {
      initData: 'vue开发环境运行成功'
    }
  },
  components: {
    Dashboard
  }
}
</script>

<style scoped>
#container {
  color: red;
  display: 'flex'
}
</style>

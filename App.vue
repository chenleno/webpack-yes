<template>
  <div id='container'>
    <h1>{{initData}}</h1>
    <div class='header'>
      我是header
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      initData: 'vue开发环境运行成功'
    }
  }
}
</script>

<style scoped>
#container {
  color: red;
  display: 'flex'
}
</style>

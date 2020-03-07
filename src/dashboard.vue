<template>
  <div>
    {{ data.title }}
    <div class='content'>{{ data.content }}</div>
  </div>
</template>

<script>
import $ from 'jquery'

setTimeout(() => {
  $('.content').css('color', 'red')
}, 1000)

export default {
  data() {
    return {
      data: {
        title: '这是一个title',
        content: window.location.host
      }
    }
  }
}
</script>

<style lang='less'>
.content {
  color: purple
}
</style>

<template>
  <el-container id="app">
      <router-view/>
  </el-container>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
@import './scss/common';
#app{
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.el-header{
    box-shadow: 7px 0 7px #b7b6b6;
    background: #fff;
}
</style>

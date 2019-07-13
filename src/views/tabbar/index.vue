<template>
  <div>
    <!-- 缓存路由组件 -->
    <keep-alive>
      <router-view></router-view>
    </keep-alive>

    <van-tabbar v-model="active">
      <van-tabbar-item icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item icon="search">问答</van-tabbar-item>
      <van-tabbar-item icon="friends-o">视频</van-tabbar-item>
      <van-tabbar-item icon="setting-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script>
export default {
  name: 'tabbar',
  data () {
    return {
      active: 0
    }
  }
}
</script>
<style>
</style>

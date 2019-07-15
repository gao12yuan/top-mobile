<template>
  <div>
    <div class="search">
      <van-search v-model="value"
                  background="5babfb"
                  input-align="center"
                  center-icon
                  placeholder="搜索" />
    </div>
    <!-- 联想建议 -->
    <van-cell-group>
      <van-cell v-for="item in suggestion"
                :key="item"
                :title="item"
                icon="location-o" />

    </van-cell-group>
    <!-- 历史记录 -->
  </div>
</template>
<script>
import { suggestion } from '@/api/suggestion'
export default {
  name: 'search',
  data () {
    return {
      value: '',
      suggestion: []
    }
  },
  watch: {
    async value (newVal) {
      console.log(newVal)
      newVal = newVal.trim()
      // 非空判断
      if (!newVal.length) {
        return
      }
      try {
        const data = await suggestion(newVal)
        console.log(data)
        this.suggestion = data.options
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.search {
  background-color: #3296fa;
  .van-search__content {
    border-radius: 40px;
    background-color: #adc7e7;
  }
}
</style>

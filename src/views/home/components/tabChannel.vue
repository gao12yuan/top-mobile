<template>
  <div>
    <van-popup :value="value"
               @input="$emit('input', $event)"
               position="bottom"
               :style="{ height: '95%'}">
      <van-grid :column-num="4">
        <div class="my-channles">
          <span>我的频道</span>
          <van-button size="mini">编辑</van-button>
        </div>
        <van-grid-item v-for="(item) in userChannels"
                       :key="item.id">
          <span class="text">
            {{ item.name }}
            <van-icon name="close" />
          </span>
        </van-grid-item>
        <div class="all-channles">
          <span>频道推荐</span>
        </div>
        <van-grid-item v-for="item  in filterChannels"
                       :key="item.id"
                       @click="handelAdd(item)">
          <span class="text">{{item.name}}</span>
        </van-grid-item>
      </van-grid>
    </van-popup>
  </div>
</template>
<script>
import { allChannel } from '@/api/channel'
export default {
  name: 'homeChannel',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    userChannels: {
      type: Array,
      default: () => []
    },
    activeIndex: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      // 所有的频道列表
      allChannels: []
    }
  },
  created () {
    this.loadChannels()
  },
  computed: {
    //  过滤出不包括用户列表的数据
    filterChannels () {
      // 数组中存储了所有用户频道id
      const data = this.userChannels.map(item => item.id)
      // 过滤用户频道id 返回一个新的数组
      return this.allChannels.filter(item => !data.includes(item.id))
    }
  },
  methods: {
    // 获取全部频道
    async loadChannels () {
      const data = await allChannel()
      console.log(data)
      this.allChannels = data.channels
    },
    // 添加频道
    handelAdd (item) {
      //  将点击添加的频道到我的频道
      this.userChannels.push(item)
    }
  }
}
</script>
<style lang="less" scoped>
.my-channles,
.all-channles {
  width: 100%;
  padding: 6px 10px;
  font-size: 16px;
  .van-button--mini {
    font-size: 12px;
    line-height: 16px;
    min-width: 46px;
    border-radius: 11px;
    border: 1px solid #f96e6e;
    color: #f96e6e;
    float: right;
    margin-top: 2px;
  }
}
.van-icon {
  position: absolute;
  background-color: transparent;
  top: -8px;
  right: -8px;
}
.van-grid-item {
  padding: 11px 10px;
}
.van-grid-item /deep/ .van-grid-item__content {
  padding: 6px 5px;
  border-radius: 5px;
  background-color: #eee;
}
.van-grid-item /deep/ .van-grid-item__content::after {
  border: 0;
}
.text {
  font-size: 12px;
}
.red {
  color: #f96e6e;
}
</style>

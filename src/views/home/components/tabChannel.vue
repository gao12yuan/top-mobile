<template>
  <div>
    <van-popup :value="value"
               @input="$emit('input', $event)"
               position="bottom"
               :style="{ height: '95%'}">
      <van-grid :column-num="4">
        <div class="my-channles">
          <span>我的频道</span>
          <van-button size="mini"
                      @click="isEdit = !isEdit">
            {{isEdit ? '完成':' 编辑' }}</van-button>
        </div>
        <van-grid-item v-for="(item, index) in userChannels"
                       :key="item.id"
                       @click="handelChannel(item,index)">
          <span class="text"
                :class="{red: index === activeIndex  && !isEdit}">
            {{ item.name }}
            <van-icon name="close"
                      v-show="isEdit" />
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
import { mapState } from 'vuex'
import { userDelect, userChannelsList } from '@/api/user'
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
      allChannels: [],
      isEdit: false
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
    },
    ...mapState(['user'])
  },
  methods: {
    // 获取全部频道
    async loadChannels () {
      const data = await allChannel()
      // console.log(data)
      this.allChannels = data.channels
    },
    // 添加频道
    async handelAdd (item) {
      // 储存当前文章列表
      item.articles = []
      // 储存下一个数据时间戳
      item.timestamp = Date.now()
      // 控制当前频道下拉刷新loading状态
      item.pullLoading = false
      // 控制当前频道上拉的loading状态
      item.upLoading = false
      // 控制当前频道数据是否加载完毕
      item.pullFinished = false
      //  将点击添加的频道到我的频道
      this.userChannels.push(item)
      // 如果用户已登录，将数据请求数据添加到后端
      if (this.user) {
        const data = this.userChannels.slice(1).map((item, index) => {
          return {
            id: item.id,
            seq: index + 2
          }
        })
        console.log(data)
        await userChannelsList(data)
        return
      }
      // 如果未登录，则将数据保存到本事存储
      window.localStorage.setItem('channels', JSON.stringify(this.userChannels))
    },
    // 切换频道
    changeChannel (item, index) {
      this.$emit('update:active-index', index)
    },
    async deleteChannel (item, index) {
      // 删除一个
      this.userChannels.splice(index, 1)
      // 如果已登录
      if (this.user) {
        if (!this.isEdit) {
          const data = await userDelect(item.id)
          console.log(data)
          return
        }
      }
      // 重新存储到本地
      window.localStorage.setItem('channels', JSON.stringify(this.userChannels))
    },
    handelChannel (item, index) {
      // 非编辑状态 切换频道
      if (!this.isEdit) {
        this.changeChannel(item, index)
      } else {
        // 编辑状态 删除
        this.deleteChannel(item, index)
      }
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

<template>
  <div>
    <!-- <div class="search">
      <van-search v-model="value"
                  background="5babfb"
                  input-align="center"
                  center-icon
                  placeholder="搜索" />
    </div> -->
    <div class="heard">
      <span>首页</span>
    </div>
    <div class="content">
      <van-tabs v-model="channelIndex">
        <div slot="nav-right"
             class="wap-nav"
             @click="ChannelShow = true">
          <van-icon name="wap-nav" />
        </div>
        <van-tab v-for="item in channels"
                 :key="item.id"
                 :title="item.name">

          <van-pull-refresh v-model="activeChannel.pullLoading"
                            :success-text="successText"
                            @refresh="onRefresh">

            <van-list v-model="activeChannel.upLoading"
                      :finished="activeChannel.pullFinished"
                      finished-text="没有更多了"
                      @load="onLoad">
              <van-cell v-for="item in activeChannel.articles"
                        :key="item.art_id.toString()"
                        :title="item.title">
                <div slot="label">
                  <template v-if="item.cover.type >0">
                    <van-grid :border="false"
                              :column-num="3">
                      <van-grid-item v-for="( item, index ) in item.cover.images"
                                     :key="index">
                        <van-image :src="item"
                                   lazy-load />
                      </van-grid-item>
                    </van-grid>
                  </template>
                  <p>
                    <span>{{item.aut_name}}</span>&nbsp;
                    <span>{{item.comm_count}}</span>&nbsp;
                    <span>{{item.pubdate}}</span>
                    <van-icon class="icon"
                              name="close"
                              @click="handelShow(item)" />
                  </p>
                </div>
              </van-cell>
            </van-list>
          </van-pull-refresh>
        </van-tab>
      </van-tabs>
    </div>
    <!-- 频道管理组件
    :active-index="channels"
     @updata:active-index="channelIndex = $event"
     以上两句可以简写成
     :active-index.sync="channelIndex"
     -->
    <tabChannel v-model="ChannelShow"
                :userChannels="channels"
                :active-index.sync="channelIndex"></tabChannel>
    <!-- 更多操作 -->
    <more-active v-model="activelShow"
                 :current-article="currentArticle"
                 @dislike-success="handelDialike"
                 @black-success="handelDialike"></more-active>
  </div>
</template>
<script>

// 用户频道
import { userChannel } from '@/api/channel'
// 热点新闻推荐
import { getArticles } from '@/api/article'
// 引入则罩层
import tabChannel from './components/tabChannel'
import moreActive from './components/active'
export default {
  name: 'Home',
  components: {
    tabChannel,
    moreActive
  },
  data () {
    return {
      // 储存频道列表
      channels: [],
      channelIndex: 0,
      ChannelShow: false,
      successText: '',
      activelShow: false,
      currentArticle: null
    }
  },
  created () {
    this.loadChannels()
  },
  watch: {
    // 监视容器中的 user 用户
    // 记住：凡是能 this. 点儿出来的成员都可以直接在这里监视
    // 由于路由缓存了，所以这里监视用户的登录状态，如果登录了，则加载用户的频道列表
    async '$store.state.user' () {
      // 重新加载用户频道列表
      this.loadChannels()
      // 频道数据改变，重新加载当前激活频道的数据
      // 只需将上拉加载更多设置为 true，它就会自动去调用 onLoad 请求函数
      this.activeChannel.upLoading = true
    }
  },
  computed: {
    // 当前激活的频道
    // eslint-disable-next-line vue/return-in-computed-property
    activeChannel () {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      // this.activeChannel.upPullLoading = true
      if (this.channels.length !== 0) {
        // console.log(this.channels[this.channelIndex])
        return this.channels[this.channelIndex]
      }
    }
  },
  methods: {
    // 获取频道
    async  loadChannels () {
      const user = this.$store.state.user

      let channels = []

      // 如果用户已登录
      if (user) {
        // 发送请求
        const data = await userChannel()
        channels = data.channels
        // console.log(data)
      } else {
        //  // 没有登录 如果有本地储存数据则用本地储存的
        const loadChannels = JSON.parse(window.localStorage.getItem('channels'))
        if (loadChannels) {
          channels = loadChannels
        } else {
          // 如果没有本地储存数据则请求默认推荐
          const data = await userChannel()
          channels = data.channels
          // console.log(data)
        }
      }
      // console.dir(channels)
      // 修改 channels，将这个数据结构修改为满足我们使用的需求
      channels.forEach(item => {
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
      })

      this.channels = channels
      // console.log(this.channels)
    },
    // 上拉
    async onLoad () {
      await this.$sleep(1000)
      // 调用
      let data = []
      data = await this.loadArticles()
      // console.log(data)
      // 如果没有数据并且没有pre_timestamp
      if (!data.pre_timestamp && !data.results.length) {
        // 结束
        this.activeChannel.pullFinished = true
        //  停止下拉刷新
        this.activeChannel.upLoading = false
        return
      }
      // 如果没有数据重新调用
      if (!data.results.length) {
        this.activeChannel.timestamp = data.pre_timestamp
        data = await this.loadArticles()
      }
      this.activeChannel.timestamp = data.pre_timestamp
      // 添加到数articles中
      this.activeChannel.articles.push(...data.results)
      // 停止下拉
      this.activeChannel.upLoading = false
    },
    // 下拉刷新 如有新数据 重置列表
    async onRefresh () {
      //  备份加载下个数据的时间戳
      const timestamp = this.activeChannel.timestamp
      // 使用新的时间戳
      this.activeChannel.timestamp = Date.now()
      // 发送请求
      const data = await this.loadArticles()
      console.log(data)
      if (data.results.length) {
        // 把新的数据赋值给activeChannel.articles
        this.activeChannel.articles = data.results
        // 更新新的时间戳
        this.activeChannel.timestamp = data.pre_timestamp
        this.successText = '更新成功'
      } else {
        this.successText = '已是最新数据'
      }
      // 下拉刷新取消
      this.activeChannel.pullLoading = false
      // 没有最新数据，将原来的用于请求下一页的时间戳恢复过来
      this.activeChannel.timestamp = timestamp
    },
    async loadArticles () {
      const { id: channelId, timestamp } = this.activeChannel
      const data = await getArticles({
        channelId,
        timestamp,
        withTop: 1
      })
      return data
    },
    handelShow (article) {
      // console.log(article)
      this.currentArticle = article
      this.activelShow = true
    },
    handelDialike () {
      const articles = this.activeChannel.articles
      const delIndex = articles.findIndex(item => item === this.currentArticle)
      console.log(delIndex)
      articles.splice(delIndex, 1)
    }
  }

}
</script>
<style lang="less" scoped>
.heard {
  background-color: hsl(210, 95%, 59%);
  text-align: center;
  height: 80px;
  line-height: 80px;
  // margin-bottom: 70px;
  // color: #fff;
}
.icon {
  float: right;
}
.search {
  background-color: #3296fa;
  .van-search__content {
    border-radius: 40px;
    background-color: #adc7e7;
  }
}
.van-list {
  margin-bottom: 100px;
}
.content /deep/ .wap-nav {
  position: fixed;
  right: 0;
  margin-top: 10px;
}
.content:nth-child(5) /deep/ {
  color: #fff;
}
</style>

<template>
  <div>
    <van-dialog :value="value"
                @input="handeInput"
                :showConfirmButton="false"
                closeOnClickOverlay>
      <van-cell-group v-if="!reportShow">
        <van-cell title="不感兴趣"
                  @click="handelDislike" />
        <van-cell title="拉黑"
                  @click="handelBlack" />
        <van-cell title="反馈垃圾内容"
                  is-link
                  @click="reportShow = true" />
      </van-cell-group>
      <van-cell-group v-else>
        <van-cell icon="arrow-left"
                  @click="reportShow = false" />
        <van-cell v-for="item in article"
                  :key="item.type"
                  :title="item.title"
                  @click="handelReport(item)" />

      </van-cell-group>
    </van-dialog>
  </div>
</template>
<script>
import { acitveDislike, artcileReport } from '@/api/article'
import { userBlackList } from '@/api/user'
export default {
  name: 'moreActive',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    currentArticle: {
      type: Object
    }
  },
  data () {
    return {
      reportShow: false,
      article: [
        { type: 1, title: '标题夸张' },
        { type: 2, title: '低俗色情' },
        { type: 3, title: '错别字多' },
        { type: 4, title: '旧闻重复' },
        { type: 5, title: '广告软文' },
        { type: 6, title: '内容不实' },
        { type: 7, title: '涉嫌违法犯罪' },
        { type: 8, title: '侵权' },
        { type: 0, title: '其他问题' }
      ]
    }
  },
  methods: {
    handeInput ($event) {
      this.$emit('input', $event)
    },
    // 不喜欢
    async handelDislike () {
      try {
        await acitveDislike(this.currentArticle.art_id)
        // 移除客户端的那个文章
        this.$emit('dislike-success')
        // 关闭对话框
        this.$emit('input', false)
        this.$toast('操作成功')
      } catch (err) {
        this.$toast('操作失败')
      }
    },
    // 加入黑名单
    async handelBlack () {
      try {
        const data = await userBlackList(this.currentArticle.aut_id)
        console.log(data)
        this.$emit('black-success')
        // 关闭对话框
        this.$emit('input', false)
        this.$toast('操作成功')
      } catch {
        this.$toast('操作失败')
      }
    },
    // 反馈垃圾内容
    async handelReport (article) {
      try {
        // console.log(article)
        await artcileReport({ targetId: this.currentArticle.art_id, type: article.type })
        // 关闭对话框
        this.$emit('input', false)
        // 提示
        this.$toast('举报成功')
      } catch (err) {
        console.log(err)
        if (err.request.status === 409) {
          this.$toast('该文章已被举报过')
        } else {
          this.$toast('操作失败')
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
</style>

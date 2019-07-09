<template>
  <div id="login">
    <van-nav-bar title="登录" />
    <form>
      <van-cell-group>
        <van-field v-model="user.mobile"
                   clearable
                   left-icon="graphic"
                   placeholder="请输入手机号" />
        <van-field v-model="user.code"
                   left-icon="lock"
                   type="password"
                   placeholder="请输入密码" />
      </van-cell-group>
      <div class="btnLogin">
        <van-button type="info"
                    @click.prevent="handelLogin">登录</van-button>
      </div>

    </form>
  </div>
</template>
<script>
import { login } from '@/api/user'
export default {
  name: 'Login',
  data () {
    return {
      user: {
        mobile: '156 9075 8079‬',
        code: ''
      }
    }
  },
  methods: {
    async handelLogin () {
      const res = await login(this.user)

      console.log(res)
    }
  }
}
</script>
<style lang="less" scoped>
.van-nav-bar__title {
  background-color: #1e89f8;
  color: #fff;
  padding: 0;
  // margin: 0;
  max-width: 100%;
}
.btnLogin {
  // width: 100%;
  margin: 0 15px;
  border-radius: 10px;
  background-color: #1e89f8;
  text-align: center;
}
</style>

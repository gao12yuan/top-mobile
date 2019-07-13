<template>
  <div id="login">
    <van-nav-bar title="登录" />
    <form>
      <van-cell-group>
        <van-field v-model="user.mobile"
                   clearable
                   v-validate="'required'"
                   name="mobile"
                   left-icon="graphic"
                   :error-message="errors.first('mobile')"
                   placeholder="请输入手机号" />
        <van-field v-model="user.code"
                   v-validate="'required'"
                   name="code"
                   :error-message="errors.first('code')"
                   left-icon="lock"
                   type="password"
                   placeholder="请输入密码" />
      </van-cell-group>
      <div class="btnLogin">
        <van-button type="info"
                    :loading="loginLoading"
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
        mobile: '18510507397',
        code: ''
      },
      loginLoading: false
    }
  },
  created () {
    this.customMessages()
  },
  methods: {
    async handelLogin () {
      try {
        this.loginLoading = true
        const valid = await this.$validator.validate()

        if (!valid) {
          this.loginLoading = false
          return
        }
        // 表单验证通过
        const data = await login(this.user)
        // 保存token
        this.$store.commit('setUser', data)
        // console.log(data)
        this.loginLoading = false
        // 跳转
        this.$router.push({
          name: 'home'
        })
      } catch (err) {
        this.loginLoading = false
        console.log(err)
        this.Toast.fail('验证失败')
      }
      // this.loginLoading = false
    },
    customMessages () {
      const dict = {
        custom: {
          mobile: {
            required: '手机号不能为空'
          },
          code: {
            required: () => '验证码不能为空'
          }
        }
      }
      this.$validator.localize('zh_CN', dict)
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

<template>
  <div class="login-container">
    <van-nav-bar
      class="app-nav-bar"
      title="登录"
      left-arrow
      @click-left="$router.back()"
    />
    <van-cell-group>
      <van-form
        :show-error="false"
        :show-error-message="false"
        validate-first
        ref="login-form"
        @submit="onLogin"
        @failed="onFailed"
      >
        <van-field
          v-model="user.mobile"
          center
          icon-prefix="toutiao"
          left-icon="shouji"
          placeholder="请输入手机号"
          name="mobile"
          :rules="formRules.mobile"
        />
        <van-field
          v-model="user.code"
          clearable
          center
          icon-prefix="toutiao"
          left-icon="yanzhengma"
          name="code"
          placeholder="请输入验证码"
          :rules="formRules.code"
        >
          <template #button>
            <van-count-down
              v-if="isCountDownShow"
              :time="1000 * 60"
              @finish="isCountDownShow = false"
              format="ss s"
            />

            <van-button
              v-else
              class="send-btn"
              size="small"
              round
              @click.prevent="onSendSms"
              :loading="isSendSmsLoading"
              >发送验证码</van-button
            >
          </template>
        </van-field>
        <div class="login-btn-wrap">
          <van-button class="login-btn" type="info" @click="onLogin" block
            >登录</van-button
          >
        </div>
      </van-form>
    </van-cell-group>
  </div>
</template>

<script>
import { login, sendSms } from "@/api/user";
import { Toast } from "vant";
export default {
  name: "",
  components: {},
  props: {},
  data() {
    return {
      user: {
        mobile: "13611111111",
        code: ""
      },
      formRules: {
        mobile: [
          { required: true, message: "请填写手机号" },
          { pattern: /^1[3|5|7|9|8]\d{9}$/, message: "手机号格式错误" }
        ],
        code: [
          { required: true, message: "请输入验证码" },
          { pattern: /^\d{6}$/, message: "验证码格式有误" }
        ]
      },
      isCountDownShow: false,
      isSendSmsLoading: false
    };
  },

  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onLogin() {
      Toast.loading({
        message: "登录中...",
        forbidClick: true, //其他功能点击无反应
        duration: 0
      });
      console.log(this.user);
      try {
        const {data} = await login(this.user);
        Toast.success("登陆成功");

        this.$store.commit('setUser',data.data)
      } catch (error) {
        if (error.response.status === 400) {
          console.log("登陆失败", error);
          Toast.fail("登录失败，手机号或验证码错误");
        }
      }
    },
    onFailed(error) {
      if (error.errors[0]) {
        this.$toast({
          message: error.errors[0].message,
          position: "top"
        });
      }
    },
    async onSendSms() {
      try {
        const vaildateRet = await this.$refs["login-form"].validate("mobile");
        this.isSendSmsLoading = true;
        const res = await sendSms(this.user.mobile);
        console.log(res);
        this.isCountDownShow = true;
      } catch (err) {
        let message = "";
        if (err && err.response && err.response.status === 429) {
          message = "发送太频繁";
        } else if (err.name === "mobile") {
          message = err.message;
        } else {
          message = "发送失败，请重新发";
        }
        console.dir(err);
        this.$toast({
          message,
          position: "top"
        });
      }
      this.isSendSmsLoading = false;
    }
  }
};
</script>

<style scoped lang="less">
.login-container {
  .send-btn {
    width: 76px;
    height: 23px;
    background-color: #ededed;
    .van-button__text {
      font-size: 11px;
      color: #666666;
    }
  }
  .login-btn-wrap {
    padding: 26px 16px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
      .van-button__text {
        font-size: 15px;
      }
    }
  }
}
</style>

<template>
  <div class="my-container">
    <van-cell-group v-if="user" class="my-info">
      <van-cell
        :border="false"
        center
        class="base-info"
      >
        <van-image
          class="avatar"
          slot="icon"
          round
          fit="cover"
          src="currentUser.photo"
        />
        <div class="name" slot="title">{{currentUser.name}}</div>
        <van-button class="update-btn" size="small" round>编辑资料</van-button>
      </van-cell>
      <van-grid :border="false" class="data-info">
        <van-grid-item>
          <div slot="text" class="text-wrap">
            <div class="count">{{currentUser.art_count}}</div>
            <div class="text">头条</div>
          </div>
        </van-grid-item>
        <van-grid-item>
          <div slot="text" class="text-wrap">
            <div class="count">{{currentUser.follow_count}}</div>
            <div class="text">关注</div>
          </div>
        </van-grid-item>
        <van-grid-item>
          <div slot="text" class="text-wrap">
            <div class="count">{{currentUser.fans_count}}</div>
            <div class="text">粉丝</div>
          </div>
        </van-grid-item>
        <van-grid-item>
          <div slot="text" class="text-wrap">
            <div class="count">{{currentUser.like_count}}</div>
            <div class="text">获赞</div>
          </div>
        </van-grid-item>
      </van-grid>
    </van-cell-group>
    <div v-else class="not-login">
      <div @click="$router.push('/login')">
        <van-image
          class="mobile"
          slot="icon"
          round
          fit="cover"
          src="https://img01.yzcdn.cn/vant/cat.jpeg"
        />
      </div>
      <div class="text">登录/注册</div>
    </div>
    <van-grid class="mb-4" :column-num="2">
      <van-grid-item icon-prefix="toutiao" icon="shoucang" text="收藏" />
      <van-grid-item icon-prefix="toutiao" icon="lishi" text="历史" />
    </van-grid>
    <van-cell title="消息通知" is-link to="" />
    <van-cell class="mb-4" title="小智同学" is-link to="" />
    <van-cell
      v-if="user"
      class="logout-cell"
      title="退出登录"
      @click="onLogout"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getCurrentUser } from "@/api/user";
export default {
  name: "MyIndex",
  components: {},
  props: {},
  data() {
    return {
      currentUser: {}
    };
  },

  computed: {
    ...mapState(["user"])
  },
  watch: {},
  created() {
    this.loadCurrentUser();
  },
  mounted() {},
  methods: {
    async loadCurrentUser() {
      const { data } = await getCurrentUser();
      // console.log(data);
      this.currentUser = data.data;
      console.log(this.currentUser);
    },
    onLogout() {
      this.$dialog
        .confirm({
          title: "退出提示",
          message: "确认退出？"
        })
        .then(() => {
          this.$store.commit("setUser", null);
        })
        .catch(() => {
          // on cancel
        });
    }
  }
};
</script>

<style scoped lang="less">
.my-container {
  .my-info {
    background: url("./world.jpg") no-repeat;
    background-size: cover;
    .base-info {
      height: 115px;
      background-color: unset;
      padding-top: 38px;
      padding-bottom: 11px;
      .avatar {
        height: 66px;
        width: 66px;
        border: 1px solid #fff;
        box-sizing: border-box;
        margin-right: 11px;
      }
      .name {
        font-size: 15px;
        color: #fff;
      }
      .update-btn {
        height: 16px;
        font-size: 12px;
        color: #666666;
      }
    }
    .data-info {
      .van-grid-item {
        height: 65px;
        color: #002;
        .text-wrap {
          display: flex;
          flex-direction: column;
          justify-content: center;
          .count {
            font-size: 18px;
          }
          .text {
            font-size: 11px;
          }
        }
      }
    }
    /deep/ .van-grid-item__content {
      background-color: unset;
    }
  }
  .not-login {
    height: 180px;
    background: url("./world.jpg") no-repeat;
    background-size: cover;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    .mobile {
      height: 66px;
      width: 66px;
      border: 1px solid #fff;
      box-sizing: border-box;
    }
    .text {
      color: #fff;
      font-size: 11px;
    }
  }
  /deep/ .van-grid-item {
    height: 70px;
    .toutiao {
      font-size: 22px;
    }
    .toutiao-lishi {
      color: #ff9d1d;
    }
    .toutiao-shoucang {
      color: #eb5253;
    }
    .van-grid-item__text {
      font-size: 14px;
      color: #333333;
    }
  }
  .mb-4 {
    margin-bottom: 4px;
  }
  .logout-cell {
    color: #d86262;
    text-align: center;
  }
}
</style>

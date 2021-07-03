<template>
  <div class="channel-edit">
    <van-cell center :border="false">
      <div slot="title" class="channel-title">我的频道</div>
      <van-button
        type="danger"
        round
        plain
        size="mini"
        @click="isEdit = !isEdit"
        >{{ isEdit ? "完成" : "编辑" }}</van-button
      >
    </van-cell>
    <van-grid :gutter="10">
      <van-grid-item
        :class="{ active: index === active }"
        :icon="isEdit && index !== 0 ? 'clear' : ''"
        v-for="(channel, index) in userChannels"
        :key="index"
        :text="channel.name"
        @click="onUserChannelClick(channel,index)"
      />
    </van-grid>

    <van-cell center :border="false">
      <div slot="title" class="channel-title">频道推荐</div>
    </van-cell>
    <van-grid :gutter="10">
      <van-grid-item
        v-for="(channel, index) in recommendChannels"
        :key="index"
        :text="channel.name"
        @click="onAdd(channel)"
      />
    </van-grid>
  </div>
</template>

<script>
import { getAllChannels,addUserChannel,deleteUserChannel } from '@/api/channel'
import {mapState} from 'vuex'
import {setItem} from '@/utils/storage'
export default {
  name: "ChannelEdit",
  components: {},
  props: {
    userChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      allChannels: [],
      isEdit: false
    };
  },

  computed: {
    ...mapState(['user']),
    recommendChannels() {
      return this.allChannels.filter(channel => {
        //filter返回满足的所有元素
        return !this.userChannels.find(userChannel => {
          //find返回单个元素
          return userChannel.id === channel.id;
        });
        // return true
      });
    }
  },
  watch: {},
  created() {
    this.loadAllChannels();
  },
  mounted() {},
  methods: {
    async loadAllChannels() {
      const { data } = await getAllChannels();
      this.allChannels = data.data.channels;
    },
    async onAdd(channel) {
      this.userChannels.push(channel);
      //数据持久化
      if(this.user){
        //登录了，数据存在线上
        await addUserChannel({
          channels:[
            {id:channel.id,seq:this.userChannels.length}
          ]
        })
      }else{
        //存在本地
        setItem('user-channels',this.userChannels)
      }
    },
    onUserChannelClick(channel,index) {
      //编辑状态删除
      if (this.isEdit && index !== 0) {
        this.deleteChannel(channel,index);
      } else {
        //非编辑状态切换频道
        this.switchChannel(index);
      }
    },
    async deleteChannel(channel,index) {
      if(index<=this.active){
        this.$emit('update-active',this.active-1)
      }
      this.userChannels.splice(index, 1);
      //数据持久化
      if(this.user){
        //登录了，数据存在线上
       await deleteUserChannel(channel.id)
      }else{
        //存在本地
        setItem('user-channels',this.userChannels)
      }
    },
    switchChannel(index) {
      //自定义，子传父
      this.$emit("update-active", index);
      this.$emit("close");
    }
  }
};
</script>

<style scoped lang="less">
.channel-edit {
  padding-top: 54px;
  .channel-title {
    font-size: 16px;
    color: #333333;
  }
  .van-grid-item {
    width: 80px;
    height: 43px;

    /deep/ .van-grid-item__content {
      background-color: #f4f5f6;
      position: relative;
      .van-grid-item__text {
        font-size: 14px;
        color: #222;
        margin-top: 0;
      }
    }
    /deep/.van-grid-item__icon {
      font-size: 20px;
      color: orange;
      position: absolute;
      right: -5px;
      top: -5px;
    }
  }
  .active {
    color: red;
    /deep/ .van-grid-item__content {
      .van-grid-item__text {
        color: orange;
      }
    }
  }
}
</style>

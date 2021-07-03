<template>
  <div class="home-container">
    <van-nav-bar class="app-nav-bar">
      <van-button
        class="search-btn"
        slot="title"
        icon="search"
        type="info"
        round
        size="small"
        >搜索
      </van-button>
    </van-nav-bar>
    <van-tabs class="channel-tabs" v-model="active">
      <van-tab
        :title="channel.name"
        v-for="channel in channels"
        :key="channel.id"
      >
        <article-list :channel="channel" />
        <!-- 标签页组件本身有一个功能，只有第一次查看标签页的时候才会渲染出内容及组件 -->
      </van-tab>
      <div slot="nav-right" class="wap-nap-placeholder"></div>
      <div
      slot="nav-right"
      @click="isChannelEditShow=true"
      class="wap-nav-wrap">
      <van-icon name="wap-nav" /></div>
    </van-tabs>
    <van-popup v-model="isChannelEditShow" position="bottom"
    class="channel-edit-popup" closeable
    close-icon-position="top-left"
    get-container="body">
    <channel-edit
    :user-channels="channels"
    :active="active"
    @close="isChannelEditShow=false"
    @update-active="onUpdateActive"
     
    />
    <!-- @update-active="active=$event" $event：事件参数（index） -->
    </van-popup>
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
import ArticleList from './components/article-list'
import ChannelEdit from './components/channel-edit'
import {mapState} from 'vuex'
import {getItem} from '@/utils/storage'
export default {
  name: "",
  components: {
    ArticleList,
    ChannelEdit
  },
  props: {},
  data() {
    return {
      active: 0,
      channels: [],
      isChannelEditShow:true
    };
  },

  computed: {
    ...mapState(['user'])
  },
  watch: {},
  created() {
    this.loadChannels();
  },
  mounted() {},
  methods: {
    async loadChannels() {
      let channels=[]
      if(this.user){
        const { data } = await getUserChannels();
      
      channels = data.data.channels
      }else{
        const localChannels=getItem('user-channels')
        if(localChannels){
          channels=localChannels
        }else{
          const { data } = await getUserChannels();
      
      channels = data.data.channels
        }
      }
      this.channels = channels
    },
    onUpdateActive(index){
      // console.log(index)
      this.active=index
    }
  }
};
</script>

<style scoped lang="less">
.home-container {
  /deep/.van-nav-bar__title {
    max-width: none;
  }
  .search-btn {
    width: 277px;
    height: 32px;
    background: #5babfb;
    border: none;
    .van-icon {
      font-size: 16px;
    }
    .van-button__text {
      font-size: 14px;
    }
  }
  .channel-tabs {
    /deep/ .van-tab {
      border-right: 1px solid #edeff3;

      border-bottom: 1px solid #edeff3;
    }
    /deep/ .van-tabs__line {
      width: 15px !important;
      height: 3px;
      background-color: #3296fa;
      bottom: 20px;
    }

  }
  .wap-nap-placeholder{
    width: 33px;
    flex-shrink: 0;
  }
  .wap-nav-wrap{
   position: fixed;
    right: 0;
    width: 33px;
    height: 43px;
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: .9;
    .van-icon{
      font-size: 24px;
    } 
    &:before{
        content: '|';
    width: 1px;
    /* height: 43px; */
    position: absolute;
    left: 0;
    // background-size: contain;
  }
  }
  
  
}
.channel-edit-popup{
    height: 100%;
  }
</style>

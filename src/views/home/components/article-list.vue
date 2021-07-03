<template>
  <div class="article-list">
    <van-pull-refresh
      v-model="isRefreshLoading"
      :success-text="refreshSuccessText"
      :success-duration="1500"
      @refresh="onRefresh"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
      <article-item
      v-for="(article,index) in articles"
      :key="index"
      :article="article"
      />
        <!-- <van-cell
          v-for="(article, index) in articles"
          :key="index"
          :title="article.title"
        /> -->
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from "@/api/article"
import ArticleItem from '@/components/article-item'
export default {
  name: "ArticleList",
  components: {
    ArticleItem
  },
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      articles: [],
      loading: false,
      finished: false,
      timestamp: null,
      isRefreshLoading: false,
      refreshSuccessText:''
    };
  },

  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onLoad() {
      const { data } = await getArticles({
        channel_id: this.channel.id,
        timestamp: this.timestamp || Date.now(),
        with_top: 1
      });
      console.log(data);
      const { results } = data.data;
      this.articles.push(...results); //合并两个数组，...扩展运算符
      this.loading = false;
      if (results.length) {
        this.timestamp = data.data.pre_timestamp;
      } else {
        this.finished = true;
      }
    },
    async onRefresh() {
      //设置加载中状态停止
      const {data}=await getArticles({
        channel_id:this.channel.id,
        timestamp:Date.now(),
        with_top:1
      })
      const {results}=data.data
      this.articles.unshift(...results)
      this.isRefreshLoading=false
      this.refreshSuccessText=`更新了${results.length}条数据`
    }
  }
};
</script>

<style scoped lang="less">
.article-list {
  position: fixed;
  right: 0;
  left: 0;
  bottom: 50px;
  top: 90px;
  overflow-y: auto;
}
</style>

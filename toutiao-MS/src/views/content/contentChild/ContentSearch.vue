<template>
  <div class="content-search-contianer">
     <div class="search-form">
    <el-form ref="searchForm" :model="searchForm" label-width="80px" size='small'>
      <el-form-item label="状态:">
      <el-radio-group v-model="searchForm.status">
    <el-radio :label="5">全部</el-radio>
    <el-radio :label="0">草稿</el-radio>
    <el-radio :label="1">待审核</el-radio>
    <el-radio :label="2">审核通过</el-radio>
    <el-radio :label="3">审核失败</el-radio>
    <el-radio :label="4">已删除</el-radio>
  </el-radio-group>
  </el-form-item>
    <el-form-item label="频道:">
      <!-- 级联选择器 -->
      <el-select v-model="searchForm.channel_id" placeholder="请选择">
    <el-option
    label="全部"
    :value="null"
    />
    <el-option
      v-for="item in articleChannel"
      :key="item.id"
      :label="item.name"
      :value="item.id">
    </el-option>
  </el-select>
    </el-form-item>
    <el-form-item label="日期:">
       <el-date-picker
      unlink-panels
      :picker-options="timeRange"
      v-model="searchForm.timeValue"
      :default-time="['00:00:00', '23:59:59']"
      type="daterange"
      range-separator="至"
      start-placeholder="开始日期"
      value-format="yyyy-MM-dd"
      end-placeholder="结束日期">
    </el-date-picker>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" round @click="filterArticle" :loading="isLoading">{{isLoading?'筛选中':'筛选'}}</el-button>
    </el-form-item>
    </el-form>
  </div>
  </div>
</template>

<script>
import { getArticleChannel } from 'api/article'
import { cloneDeep } from 'lodash'
import { mapMutations, mapState } from 'vuex'
export default {
  name: 'ContentSearch',
  data () {
    return {
      searchForm: {
        status: '',
        channel_id: '',
        timeValue: []
      },
      // 不要当天以后的日期
      timeRange: {
        disabledDate: time => {
          return time.getTime() > Date.now()
        }
      },
      // 频道列表
      articleChannel: []
    }
  },
  created () {
    // 加载文章频道列表
    this.onloadArticleChannel()
  },
  mounted () {

  },
  methods: {
    ...mapMutations(['startLoading']),
    // 加载文章频道
    async onloadArticleChannel () {
      const { data: res } = await getArticleChannel()
      this.articleChannel = res.data.channels
    },
    // 对表单的数据进行处理,在传给父组件
    filterArticle () {
      // 深拷贝一份搜索表单数据
      this.startLoading()
      const deepCopySearchForm = cloneDeep(this.searchForm)
      // status等于5或者空,要么用户选了全部,要么用户没选,这里要对用户选择后的数据进行处理
      if (deepCopySearchForm.status === 5 || deepCopySearchForm.status === '') {
        delete deepCopySearchForm.status
      }
      if (deepCopySearchForm.timeValue) {
        deepCopySearchForm.begin_pubdate = deepCopySearchForm.timeValue[0]
        deepCopySearchForm.end_pubdate = deepCopySearchForm.timeValue[1]
        delete deepCopySearchForm.timeValue
      }
      if (deepCopySearchForm.channel_id === '') {
        delete deepCopySearchForm.channel_id
      }
      if (!deepCopySearchForm.timeValue) {
        delete deepCopySearchForm.timeValue
      }
      deepCopySearchForm.page = 1
      deepCopySearchForm.per_page = 10
      this.$bus.$emit('refresh-article-table', deepCopySearchForm)
    }
  },
  computed: {
    ...mapState(['isLoading'])
  }
}
</script>

<style scoped lang="less">

</style>

<template>
  <div class="content-container">
    <div class="content-management">
      <el-card class="box-card">
    <div slot="header" class="clearfix">
      <bread-crumb second-name="内容管理"></bread-crumb>
    </div>
    <content-search></content-search>
    </el-card>
    <el-card>
      <div slot="header" class="clearfix">
      <span>共找到{{ total }}条记录</span>
  </div>
      <content-table @total-count="onGetTotalCount"></content-table>
    </el-card>
    </div>
    <div class="content-search-result"></div>
  </div>
</template>

<script>
import BreadCrumb from 'components/common/BreadCrumb'
import ContentSearch from './contentChild/ContentSearch.vue'
import ContentTable from './contentChild/ContentTable.vue'
export default {
  name: 'Content',
  components: { BreadCrumb, ContentTable, ContentSearch },
  data () {
    return {
      // 文章总数
      total: 0
    }
  },
  created () {

  },
  mounted () {

  },
  methods: {
    onGetTotalCount (total) {
      this.total = total
    }
  }
}
</script>

<style scoped lang="less">
.content-container{
  .el-card{
    &:first-child{
      margin-bottom: 30px;
    }
  }
}
</style>

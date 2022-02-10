<template>
  <div class="comment-container">
    <el-card>
      <div slot="header" class="clearfix">
        <bread-crumb second-name="内容管理"></bread-crumb>
      </div>
      <el-table
        :data="commentArticleList"
        style="width: 100%"
        max-height="500"
        v-loading="isTableLoading"
        element-loading-text="资源加载中,请稍后"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.5)"
      >
        <el-table-column prop="title" label="标题" min-width="200">
        </el-table-column>
        <el-table-column
          prop="total_comment_count"
          label="总评论数"
          min-width="150"
        >
        </el-table-column>
        <el-table-column
          prop="fans_comment_count"
          label="粉丝评论数"
          min-width="150"
        >
        </el-table-column>
        <el-table-column prop="comment_status" label="评论状态" min-width="150">
          <template #default="{row}">
            <el-tag v-if="row.comment_status === true" type="success"
              >开启</el-tag
            >
            <el-tag v-else type="danger">关闭</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="180">
          <template #default="{row}">
            <el-switch
              v-model="row.comment_status"
              active-color="#13ce66"
              inactive-color="#ffa3a6"
              :disabled="row.commentStatus"
              @change="handleCommentStatus(row)"
            >
            </el-switch>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :disabled="isPaginationDisabled"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size.sync="perPage"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import BreadCrumb from 'components/common/BreadCrumb'
import { getArticleList, changeArticleCommentStatus } from 'api/article'
export default {
  name: 'Comment',
  data () {
    return {
      // 文章列表
      commentArticleList: [],
      // 当前页
      currentPage: 1,
      // 每页数量
      perPage: 10,
      // 总条目数
      total: 0,
      // 是否禁用分页
      isPaginationDisabled: false,
      // 表格是否处于数据正在加载的模式
      isTableLoading: false
    }
  },
  components: {
    BreadCrumb
  },
  created () {
    this.onLoadArticleList()
  },
  mounted () {},
  methods: {
    // 加载文章列表
    async onLoadArticleList () {
      this.isPaginationDisabled = true
      this.isTableLoading = true
      const { data: res } = await getArticleList({
        page: this.currentPage,
        per_page: this.perPage,
        response_type: 'comment'
      })
      this.total = res.data.total_count
      // 给每个评论设置单独的评论状态
      res.data.results.forEach(val => {
        val.commentStatus = false
      })
      this.commentArticleList = res.data.results
      this.isPaginationDisabled = false
      this.isTableLoading = false
    },
    // 切换文章评论状态
    async handleCommentStatus (val) {
      val.commentStatus = true
      const { data: res } = await changeArticleCommentStatus(
        val.id.toString(),
        val.commentStatus
      )
      if (res.message === 'OK') {
        this.$message({
          type: 'success',
          message: '修改成功'
        })
      } else {
        this.$message({
          type: 'error',
          message: '修改状态失败,请稍后再试'
        })
      }
      val.commentStatus = false
    },
    // 处理当前页码改变
    handleCurrentChange () {
      this.onLoadArticleList()
    },
    // 处理每页多少条的显示
    handleSizeChange () {
      this.currentPage = 1
      this.onLoadArticleList()
    }
  }
}
</script>

<style scoped lang="less">
.comment-container {
  /deep/ .el-pagination {
    margin-top: 20px;
    text-align: center;
  }
}
</style>

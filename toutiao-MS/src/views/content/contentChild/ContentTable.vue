<template>
  <div class="content-table-container">
    <el-table
      :data="articleData"
      stripe
      style="width: 100%"
      height="500"
      v-loading="isLoading"
      element-loading-background="rgba(0, 0, 0, 1)"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
    >
      <el-table-column label="封面" width="300">
        <template #default="{row}">
          <el-avatar :size="80" v-if="row.cover.type === 0" shape="square">
            <span>暂无图片</span>
          </el-avatar>
          <el-avatar
            :size="80"
            v-else
            v-for="(item, index) in row.cover.images"
            :key="index"
            shape="square"
          >
            <el-image
              :preview-src-list="row.cover.images"
              :src="item"
              style="width:100%;height:100%;"
            >
              <template #error>
                <img
                  src="~assets/images/content/图片加载失败.png"
                  style="width:100%;height:100%;"
                />
              </template>
            </el-image>
          </el-avatar>
        </template>
      </el-table-column>
      <el-table-column width="300px" prop="title" label="标题">
      </el-table-column>
      <el-table-column width="150" label="状态">
        <template #default="{row}">
          <el-tag type="info" v-if="row.status === 0">草稿</el-tag>
          <el-tag type="info" v-else-if="row.status === 1">待审核</el-tag>
          <el-tag type="success" v-else-if="row.status === 2">审核通过</el-tag>
          <el-tag type="warning" v-else-if="row.status === 3">审核失败</el-tag>
          <el-tag type="danger" v-else>已删除</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="发布时间" prop="pubdate"> </el-table-column>
      <el-table-column width="150" label="操作">
        <template #default="{row}">
          <el-button type="text" @click="updateArticle(row.id)">编辑</el-button>
          <el-button
            type="text"
            class="delete-btn"
            @click="onDeleteArticle(row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :disabled="isLoading"
      background
      layout="prev, pager, next"
      @current-change="handleChangeCurrentPage"
      :total="totalCount"
    >
    </el-pagination>
  </div>
</template>

<script>
import { getArticleList, deleteArticle } from 'api/article'
import sleep from 'utils/sleep'
import { mapMutations } from 'vuex'
export default {
  name: 'ContentTable',
  data () {
    return {
      // 文章数据
      articleData: [],
      // 是否显示表格正在加载
      isLoading: true,
      // 文章总数
      totalCount: 0,
      // 查询条件
      query: {}
    }
  },
  created () {
    this.onloadArcitleList()
    this.$bus.$on('refresh-article-table', params => {
      this.isLoading = true
      this.query = params
      getArticleList(params)
        .then(res => {
          const { data } = res
          this.totalCount = data.data.total_count
          this.articleData = data.data.results
          this.$emit('total-count', data.data.total_count)
          this.$nextTick(async () => {
            await sleep(500)
            this.isLoading = false
            this.stopLoading()
          })
        })
        .catch(err => {
          console.log(err)
          this.$message.warning('服务错误,请稍后再试')
          this.stopLoading()
          this.isLoading = false
        })
    })
  },
  mounted () {},
  methods: {
    ...mapMutations(['stopLoading']),
    // 加载文章列表
    async onloadArcitleList (query = {}) {
      this.isLoading = true
      this.refreshTable()
      this.$nextTick(async () => {
        await sleep(1000)
        this.isLoading = false
      })
    },
    // 图片加载失败时弄一个本地的图片去填充
    errorImage () {
      console.log('err')
      return (
        'this.src="' +
        require('../../../assets/images/content/图片加载失败.png') +
        '"'
      )
    },
    // 处理当前页码改变
    async handleChangeCurrentPage (currentPage) {
      this.isLoading = true
      this.query.page = currentPage
      await sleep(10)
      this.onloadArcitleList(this.query)
    },
    onDeleteArticle (target) {
      this.$confirm('确定要删除该文章吗?', '确认消息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
        beforeClose: async (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '删除中...'
            try {
              await deleteArticle(target.toString())
              this.$message.success('删除成功')
              instance.confirmButtonLoading = false
              this.refreshTable()
              done()
            } catch (error) {
              this.$message.error('删除失败,请稍后再试')
              done()
            }
          } else {
            done()
          }
        }
      })
        .then(() => {})
        .catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // })
        })
    },
    // 刷新表格
    async refreshTable () {
      const { data: res } = await getArticleList(this.query)
      this.totalCount = res.data.total_count
      this.articleData = res.data.results
      this.$emit('total-count', res.data.total_count)
    },
    // 编辑
    updateArticle (articleId) {
      this.$router.push({
        path: '/layout/essay',
        query: {
          articleId
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.content-table-container {
  .delete-btn {
    color: #fc559b;
  }
  .el-pagination {
    margin-top: 30px;
    text-align: right;
  }
  .el-avatar:not(:first-child) {
    margin-left: 10px;
  }
}
</style>

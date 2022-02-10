<template>
  <div class="fans-container">
    <el-card>
      <div slot="header" class="clearfix">
        <bread-crumb second-name="粉丝管理"></bread-crumb>
      </div>
      <div class="userinfo-container">
        <div class="userinfo" v-for="item in fansList" :key="item.id">
          <div class="user-photo">
            <el-image :src="item.photo" style="width:100%;height:100%;">
              <template #error>
                <img
                  src="~assets/images/content/图片加载失败.png"
                  style="width:100%;height:100%;"
                />
              </template>
            </el-image>
          </div>
          <div class="username">{{ item.name }}</div>
          <el-button class="focus-btn" size="small" type="primary"
            >+关注</el-button
          >
        </div>
      </div>
      <el-pagination
        :disabled="isPaginationDisabled"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size.sync="perPage"
        layout="total, sizes, prev, pager, next, jumper"
        :total="fansTotal"
        background
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import BreadCrumb from 'components/common/BreadCrumb'
import { getFansList } from 'api/user'
export default {
  name: 'Fans',
  data () {
    return {
      fansList: [],
      currentPage: 1,
      perPage: 20,
      fansTotal: 0
    }
  },
  created () {
    this.onGetFansList()
  },
  components: {
    BreadCrumb
  },
  mounted () {},
  methods: {
    // 得到粉丝列表
    async onGetFansList (page = 1, perPage = 20) {
      const { data: res } = await getFansList({
        page,
        per_page: perPage
      })
      this.fansList = res.data.results
      this.fansTotal = res.data.total_count
    },
    // 处理每页数量改变

    handleSizeChange () {
      this.currentPage = 1
      this.onLoadArticleList()
    },
    // 处理当前页码改变
    handleCurrentChange () {
      this.onLoadArticleList(this.currentPage, this.perPage)
    }
  }
}
</script>

<style scoped lang="less">
.fans-container {
  .userinfo-container {
    display: flex;
    justify-content: flex-start;
    margin-right: -20px;
    flex-wrap: wrap;
    margin-bottom: 20px;
    .userinfo {
      margin-right: 20px;
      width: 150px;
      height: 200px;
      border: 1px dashed #eee;
      box-sizing: border-box;
      padding: 20px 30px 10px 30px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      /deep/ .user-photo {
        height: 80px;
        width: 80px;
        img {
          border-radius: 50%;
        }
      }
      .username {
        text-align: center;
        font-size: 16px;
        color: pink;
      }
      .focus-btn {
        border-radius: 30px;
      }
      margin-bottom: 20px;
    }
  }
  /deep/ .el-pagination {
    text-align: center;
  }
}
</style>

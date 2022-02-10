<template>
  <div class="fodder-container">
    <div class="action-btn">
      <el-radio-group v-model="category" size="medium" @change="changeCategory">
        <el-radio-button :label="false">全部</el-radio-button>
        <el-radio-button :label="true">收藏</el-radio-button>
      </el-radio-group>
      <el-button
        type="success"
        size="small"
        @click="isShowuploadDialog = true"
        v-show="!hideUpload"
        >上传图片</el-button
      >
    </div>
    <el-row :gutter="10">
      <el-col
        :xs="12"
        :sm="8"
        :md="6"
        :lg="4"
        :xl="4"
        v-for="(item, index) in images"
        :key="index"
      >
        <el-image
          :src="item.url"
          fit="cover"
          class="material-image"
          @click="onSelect(index, item.url)"
        >
        </el-image>
        <el-image
          class="selected"
          :src="require('@/assets/images/essay/selected.png')"
          v-if="currentSelectedIndex === index && hideSelect"
        ></el-image>
        <div :class="{ 'collect-delete': true }" v-show="!hideAction">
          <el-button
            type="warning"
            :icon="item.is_collected ? 'el-icon-star-on' : 'el-icon-star-off'"
            circle
            :loading="item.loading"
            size="small"
            @click.stop="onCollectImage(item)"
          ></el-button>
          <el-button
            :loading="item.loading"
            type="danger"
            icon="el-icon-delete"
            circle
            size="small"
            @click="onDeleteImage(item)"
          ></el-button>
        </div>
      </el-col>
    </el-row>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="imgTotal"
      @current-change="handleCurrentPageChange"
      :disabled="isDisable"
    >
    </el-pagination>
    <el-dialog
      title="上传图片"
      :visible.sync="isShowuploadDialog"
      :modal-append-to-body="false"
      width="28%"
    >
      <el-upload
        class="upload-demo"
        :show-file-list="false"
        name="image"
        drag
        action="http://api-toutiao-web.itheima.net/mp/v1_0/user/images"
        :headers="uploadHeaders"
        :on-success="uploadSuccess"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text" style="width:100%">
          将文件拖到此处，或<em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">
          只能上传jpg/png文件，且不超过500kb
        </div>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import { getUserImages, collectImage, deleteImage } from 'api/image'
import { getItem } from 'utils/storage'
export default {
  name: 'Fodder',
  data () {
    const { token } = getItem('userInfo')
    return {
      category: false,
      // 用户收藏的图片
      collectImages: [],
      // 所有图片
      allImages: [],
      images: [],
      // 上传文件对话框的显示与隐藏
      isShowuploadDialog: false,
      // 上传文件的请求头
      uploadHeaders: {
        Authorization: `Bearer ${token}`
      },
      // 全部或收藏图片总数
      imgTotal: 0,
      // 当前处于全部还是收藏
      currentStatus: false,
      // 当前页数
      currentPage: 1,
      // 是否禁用
      isDisable: false,
      // 当前选中的图片索引
      currentSelectedIndex: -1,
      selectedImgUrl: ''
    }
  },
  props: {
    hideAction: {
      type: Boolean,
      default: false
    },
    hideUpload: {
      type: Boolean,
      default: false
    },
    hideSelect: {
      type: Boolean,
      default: false
    }
  },
  components: {},
  computed: {},
  watch: {
    // 全部切换到收藏,收藏切换到全部,currentPage肯定变了,直接监听,值变了直接格式化状态
    currentStatus: {
      handler: function () {
        console.log(11111)
        this.currentPage = 1
        this.imgTotal = 0
        this.loadUserImage()
      }
    }
  },
  created () {
    this.loadUserImage()
  },
  mounted () {},
  methods: {
    async loadUserImage (page = this.currentPage, per_page = 20) {
      this.isDisable = true
      const { data: res } = await getUserImages({
        collect: this.currentStatus,
        page,
        per_page
      })
      this.images = res.data.results
      // 给每个图片加一个单独的loading标识
      this.images.forEach(val => {
        val.loading = false
      })
      this.isDisable = false
      if (this.imgTotal === 0) {
        this.imgTotal = res.data.total_count
      }
      if (this.currentStatus === false) {
        this.allImages = this.images
      } else {
        this.collectImages = this.images
      }
    },
    changeCategory (collect) {
      this.currentStatus = collect
    },
    // 上传成功的回调
    async uploadSuccess () {
      this.isShowuploadDialog = false
      this.$message.success('上传成功')
      // 刷新一下全部列表数据
      const { data: res } = await getUserImages({
        collect: false
      })
      this.images = res.data.results
    },
    handleCurrentPageChange (currentPage) {
      this.loadUserImage(currentPage)
      this.currentSelectedIndex = -1
    },
    async onCollectImage (image) {
      image.loading = true
      const { data: res } = await collectImage(image.id, !image.is_collected)
      if (res.message !== 'OK') {
        this.$message({
          type: 'error',
          message: '操作失败请稍后再试'
        })
      } else {
        this.loadUserImage()
      }
      image.loading = false
    },
    onDeleteImage (image) {
      image.loading = true
      this.$confirm('删除之后不可恢复, 是否继续?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await deleteImage(image.id)
          image.loading = false
          this.loadUserImage()
          this.$message({
            type: 'success',
            message: '删除成功'
          })
        })
        .catch(() => {})
    },
    onSelect (index, imgUrl) {
      this.currentSelectedIndex = index
      this.$emit('selected-img', imgUrl)
    }
  }
}
</script>

<style scoped lang="less">
.fodder-container {
  /deep/ .el-pagination {
    margin-top: 20px;
    text-align: center;
  }
  .user-img {
    height: 300px;
  }
  .el-row {
    margin-top: 30px;
  }
  .action-btn {
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    padding-right: 8%;
  }
  /deep/ .el-col {
    position: relative;
  }
  .collect-delete {
    position: absolute;
    bottom: 4px;
    height: 39px;
    left: 6px;
    right: 6px;
    background-color: rgba(204, 204, 204, 0.5);
    justify-content: space-evenly;
    display: flex;
    align-items: center;
    z-index: 1000;
    /deep/ .el-icon-star-on {
      font-size: 13px !important;
    }
    /deep/ .el-icon-delete {
      font-size: 13px !important;
    }
  }
  .material-image {
    height: 150px;
    width: 100%;
    position: relative;
    z-index: 998;
    cursor: pointer;
  }
  .selected {
    height: 150px;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 999;
  }
}
</style>

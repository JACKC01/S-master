<template>
  <div class="image-cover-container">
    <div class="image-container" @click="isShowSelectImageCoverDialog = true">
      <img
        alt=""
        class="image-cover"
        ref="imageCover"
        :src="imgUrl"
        v-show="imgUrl || isShowImageCover"
      />
    </div>
    <el-dialog
      title="选择封面"
      :modal-append-to-body="false"
      width="70%"
      :visible.sync="isShowSelectImageCoverDialog"
    >
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="素材库" name="material-library">
          <Fodder
            hideSelect
            hide-action
            hide-upload
            @selected-img="handleSelectedImg"
          ></Fodder>
        </el-tab-pane>
        <el-tab-pane label="上传图片" name="upload-image">
          <input type="file" ref="file" @change="onFileChange" />
          <img
            ref="dialogImageCover"
            class="dialog-image-cover"
            style="width: 150px;height:150px;display:block;"
          />
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowSelectImageCoverDialog = false"
          >取 消</el-button
        >
        <el-button type="primary" @click="onConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { uploadImg } from 'api/image'
import Fodder from 'components/common/Fodder'
export default {
  name: 'ImageCover',
  data () {
    return {
      // 是否显示选择图片封面对话框
      isShowSelectImageCoverDialog: false,
      // 激活的tab
      activeName: 'material-library',
      isShowImageCover: false,
      selectedImgUrl: ''
    }
  },
  props: {
    imgUrl: {
      type: String,
      default: ''
    }
  },
  components: {
    Fodder
  },
  computed: {},
  watch: {},

  created () {},
  mounted () {},
  methods: {
    onFileChange () {
      // 获取文件对象
      const file = this.$refs.file.files[0]
      // 本地照片src
      const fileSrc = window.URL.createObjectURL(file)
      this.$refs.dialogImageCover.src = fileSrc
      // 能够使上传相同的照片也能触发input的change事件
      // this.$refs.file.value = ''
    },
    onConfirm () {
      if (this.activeName === 'material-library') {
        if (this.selectedImgUrl === '') {
          return this.$message.warning('请选择一张封面图片')
        }
        this.isShowSelectImageCoverDialog = false
        this.$refs.imageCover.src = this.selectedImgUrl
        this.isShowImageCover = true
        this.$emit('upload-image', this.selectedImgUrl)
      } else {
        if (this.$refs.dialogImageCover.src) {
          const file = this.$refs.file.files[0]
          const fd = new FormData()
          fd.append('image', file)
          this.$refs.imageCover.src = this.$refs.dialogImageCover.src
          this.onUploadImg(fd)
          // 关闭弹窗
          this.isShowSelectImageCoverDialog = false
          this.$refs.file.value = ''
          // 显示imgDom节点
          this.isShowImageCover = true
        } else {
          this.$message.warning('您还未选择图片')
        }
      }
    },
    async onUploadImg (file) {
      const { data: res } = await uploadImg(file)
      const url = res.data.url
      this.$emit('upload-image', url)
    },
    closeDialog () {
      this.isShowSelectImageCoverDialog = false
    },
    handleSelectedImg (imgUrl) {
      this.selectedImgUrl = imgUrl
    }
  }
}
</script>

<style scoped lang="less">
.image-cover-container {
  cursor: pointer;
  .image-container {
    width: 170px;
    height: 140px;
    border: 1px solid #000;
    margin-right: 10px;

    .image-cover {
      width: 100%;
      height: 100%;
    }
  }
  /deep/ .el-dialog {
    margin-top: 8vh !important;
    .fodder-container {
      max-height: 350px;
      overflow-y: auto;
    }
  }
}
</style>

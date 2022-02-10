<template>
  <div class="setting-container">
    <el-card class="box-card">
      <template #header class="clearfix">
        <BreadCrumb second-name="个人设置"></BreadCrumb>
      </template>
      <el-row>
        <el-col :span="16">
          <el-form ref="form" :model="userinfoForm" label-width="80px">
            <el-form-item label="编号">
              {{ userDetailInfo.id }}
            </el-form-item>
            <el-form-item label="手机">
              {{ userDetailInfo.mobile }}
            </el-form-item>
            <el-form-item label="用户名称">
              <el-input v-model="userinfoForm.name"></el-input>
            </el-form-item>
            <el-form-item label="用户介绍">
              <el-input type="textarea" :rows="2" v-model="userinfoForm.intro">
              </el-input>
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="userinfoForm.email"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="onSubmit"
                :loading="isSubmiting"
                >{{ isSubmiting ? '修改中...' : '确定' }}</el-button
              >
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="8" class="avatar-col">
          <el-avatar :size="150" :src="userDetailInfo.photo"></el-avatar>
          <el-button class="change-photo" type="primary" @click="changePhoto"
            >修改头像</el-button
          >
          <input type="file" ref="file" @change="onSelectPhoto" hidden />
        </el-col>
      </el-row>
    </el-card>
    <el-dialog
      title="修改头像"
      :visible.sync="isShowUploadPhotoDialog"
      width="30%"
      :before-close="handleClose"
      @opened="onOpened"
      destroy-on-close
      append-to-body
    >
      <div style="width=100%">
        <img
          :src="avatar"
          alt=""
          class="avatar"
          ref="avatar"
          style="max-width: 100%;
    display: block;"
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowUploadPhotoDialog = false">取 消</el-button>
        <el-button type="primary" @click="onUpload" :loading="uploadLoading">{{
          uploadLoading ? '上传中' : '确定'
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import BreadCrumb from 'components/common/BreadCrumb'
import { uploadUserAvatar } from 'api/image'
import { changeUserProfile, getUserProfile } from 'api/user'
import { mapState, mapMutations } from 'vuex'
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'
export default {
  name: 'Setting',
  data () {
    return {
      userinfoForm: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
        intro: '',
        email: '',
        photo: ''
      },
      // 上传头像对话框的关闭与打开
      isShowUploadPhotoDialog: false,
      avatar: '',
      cropper: null,
      // 上传头像时的loading
      uploadLoading: false,
      // 修改用户信息时的loading
      isSubmiting: false
    }
  },
  components: {
    BreadCrumb
  },
  computed: {
    ...mapState(['userDetailInfo'])
  },
  created () {
    this.onGetUserProfile()
  },
  mounted () {},
  methods: {
    ...mapMutations(['setUserDetailInfo', 'updateUserDetailInfo']),
    async onSubmit () {
      const { data: res } = await changeUserProfile({
        name: this.userinfoForm.name,
        intro: this.userinfoForm.intro,
        email: this.userinfoForm.email
      })
      this.userinfoForm.name = res.data.name
      this.userinfoForm.intro = res.data.intro
      this.userinfoForm.email = res.data.email
      delete this.userinfoForm.photo
      this.$message.success('用户信息更新成功')
      this.$bus.$emit('change-header-info', this.userinfoForm)
    },
    changePhoto () {
      this.$refs.file.click()
    },
    onSelectPhoto () {
      // 获取file对象
      const file = this.$refs.file.files[0]
      this.avatar = window.URL.createObjectURL(file)
      this.isShowUploadPhotoDialog = true
      // 不把input输入框的value置空,用户选择相同的一张照片不能触发input的change事件
      this.$refs.file.value = ''
    },
    onOpened () {
      const image = this.$refs.avatar
      this.cropper = new Cropper(image, {
        aspectRatio: 16 / 9,
        viewMode: 1
      })
    },
    handleClose (done) {
      this.$refs.file.value = ''
      this.cropper.destroy()
      done()
    },
    onUpload () {
      this.uploadLoading = true
      this.cropper.getCroppedCanvas().toBlob(async file => {
        const fd = new FormData()
        fd.append('photo', file)
        const avatarUrl = window.URL.createObjectURL(file)
        try {
          await uploadUserAvatar(fd)
          this.isShowUploadPhotoDialog = false
          this.updateUserDetailInfo({
            photo: avatarUrl
          })
          this.avatar = avatarUrl
          console.log(222)
          this.$message.success('更新头像成功')
          console.log(222)
          this.uploadLoading = false
          console.log(1111)
        } catch (error) {
          this.$message.warning('更新头像失败,请稍后再试')
          this.uploadLoading = false
        }
      })
    },
    async onGetUserProfile () {
      const { data: res } = await getUserProfile()
      const { name, email, intro } = res.data
      this.userinfoForm.name = name
      this.userinfoForm.email = email
      this.userinfoForm.intro = intro
    }
  }
}
</script>

<style scoped lang="less">
.setting-container {
  .avatar-col {
    text-align: center;
    .change-photo {
      display: block;
      margin: 20px auto 0;
    }
  }
  .avatar {
    max-width: 100%;
    display: block;
  }
}
</style>

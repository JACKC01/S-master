<template>
  <div class="header-container">
    <div class="title">xx科技有限公司</div>
    <div class="avatar-setting">
      <el-avatar>
        <el-image
          :src="userProfile && userProfile.photo ? userProfile.photo : ''"
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
      <el-dropdown>
        <span class="el-dropdown-link">
          {{ userProfile && userProfile.name ? userProfile.name : ''
          }}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item class="el-icon-setting"
            ><span style="margin-left:5px">个人设置</span></el-dropdown-item
          >
          <el-dropdown-item
            class="iconfont icon-exit"
            @click.native="onExitLogin"
            ><span>退出登录</span></el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: 'HeaderArea',
  props: {
    userProfile: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {}
  },
  created () {},
  mounted () {},
  methods: {
    ...mapMutations(['removeUserInfo']),
    // 退出登录处理
    onExitLogin () {
      this.$confirm('确定要退出吗?', '提示消息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.removeUserInfo()
          this.$router.replace('/login')
          this.$message.success('退出成功')
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消退出'
          })
        })
    }
  }
  // computed: {
  //   ...mapState(['userInfo'])
  // }
}
</script>

<style scoped lang="less">
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  border-bottom: 1px solid #eee;
  .avatar-setting {
    display: flex;
    align-items: center;
  }
  .el-dropdown-link {
    cursor: pointer;
    color: #409eff;
    margin-left: 10px;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
  .demonstration {
    display: block;
    color: #8492a6;
    font-size: 14px;
    margin-bottom: 20px;
  }
}
</style>

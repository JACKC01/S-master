<template>
  <div class="layout-container">
    <el-container>
      <el-aside width="230px" :class="{ 'collapse-side-menu': isCollapse }">
        <div class="collapse">
          <i
            :class="{
              'el-icon-s-fold': !isCollapse,
              'el-icon-s-unfold': isCollapse
            }"
            @click="onCollapseSideMenu"
          ></i>
        </div>
        <side-menu :is-collapse="isCollapse"></side-menu>
      </el-aside>
      <el-container>
        <el-header>
          <header-area :user-profile="userProfile"></header-area>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
// import location from 'utils/location.js'
import SideMenu from './layoutChild/SideMenu.vue'
import HeaderArea from './layoutChild/HeaderArea.vue'
import { getUserProfile } from 'api/user'
import { mapMutations } from 'vuex'
export default {
  name: 'Layout',
  data () {
    return {
      // 是否折叠了侧边栏
      isCollapse: false,
      location: '',
      lat: 0,
      lng: 0,
      // 用户个人信息
      userProfile: null
    }
  },
  components: { SideMenu, HeaderArea },
  created () {
    this.onloadUserProfile()
    this.$bus.$on('change-header-info', obj => {
      Object.assign(this.userProfile, obj)
      this.addUserInfoAttr(obj)
    })
  },
  mounted () {},
  methods: {
    ...mapMutations(['setUserDetailInfo', 'addUserInfoAttr']),
    onCollapseSideMenu () {
      this.isCollapse = !this.isCollapse
    },
    // 加载用户信息
    async onloadUserProfile () {
      const { data: res } = await getUserProfile()
      this.userProfile = res.data
      this.setUserDetailInfo(res.data)
    }
  }
}
</script>

<style scoped lang="less">
.layout-container {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  .collapse {
    text-align: center;
    line-height: 40px;
    background-color: #545c64;
    i {
      color: #fff;
      cursor: pointer;
      font-size: 19px;
    }
  }
  .el-aside {
    background-color: #545c64;
    overflow: unset;
    height: 100%;
    transition: width 0.8s;
  }
  .el-container {
    height: 100%;
  }
  .el-header {
    background-color: #fff;
  }
}
.collapse-side-menu {
  width: 45px !important;
  transition: width 0.8s;
}
</style>

<template>
  <div class="side-menu-container">
    <el-menu
      router
      :default-active="activePath"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#169fe6"
    >
      <el-menu-item
        v-for="(item, index) in menuInfo"
        :key="index"
        :index="item.path"
        @click="onSaveActivePath(item.path)"
      >
        <i :class="[item.icon, isCollapse ? 'collapse' : 'no-collapse']"></i>
        <span slot="title">{{ item.name }}</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'SideMenu',
  data () {
    return {
      // 列表信息
      menuInfo: [
        { path: '/layout/home', name: '首页', icon: 'el-icon-s-home' },
        { path: '/layout/content', name: '内容管理', icon: 'el-icon-menu' },
        { path: '/layout/material', name: '素材', icon: 'el-icon-document' },
        {
          path: '/layout/essay',
          name: '发布文章',
          icon: 'el-icon-s-promotion'
        },
        {
          path: '/layout/comment',
          name: '评论管理',
          icon: 'el-icon-s-comment'
        },
        { path: '/layout/fans', name: '粉丝管理', icon: 'el-icon-coordinate' },
        { path: '/layout/setting', name: '个人设置', icon: 'el-icon-setting' }
      ]
    }
  },
  props: {
    isCollapse: {
      type: Boolean,
      default: false
    }
  },
  created () {},
  mounted () {},
  methods: {
    onSaveActivePath (path) {
      window.sessionStorage.setItem('activePath', path)
    }
  },
  computed: {
    activePath () {
      return this.$route.path
    }
  }
}
</script>

<style scoped lang="less">
.side-menu-container {
  .el-menu {
    border: unset;
    overflow: hidden;
  }
  .collapse {
    margin-right: 10px !important;
    transform: translateX(-10px);
    transition: 1s;
  }
  .no-collapse {
    transition: 1s;
  }
  //  /deep/ .el-menu-item{
  //       padding-left: 10px;
  //   }
}
</style>

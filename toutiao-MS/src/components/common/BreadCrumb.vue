<template>
  <div class="bread-crumb-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/layout/home' }"
        ><span>首页</span></el-breadcrumb-item
      >
      <el-breadcrumb-item>{{ secondName }}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  name: 'BreadCrumb',
  props: {
    secondName: {
      type: String
    }
  },
  data () {
    return {}
  },
  created () {},
  mounted () {},
  methods: {}
}
</script>

<style scoped lang="less"></style>

<template>
  <div class="material-container">
    <el-card class="box-card">
      <template #header class="clearfix">
        <BreadCrumb second-name="素材管理"></BreadCrumb>
      </template>
      <Fodder></Fodder>
    </el-card>
  </div>
</template>

<script>
import BreadCrumb from 'components/common/BreadCrumb'
import Fodder from 'components/common/Fodder'
export default {
  name: 'Material',
  data () {
    return {}
  },
  components: {
    BreadCrumb,
    Fodder
  },
  created () {},
  mounted () {},
  methods: {
    // 加载图片
  },
  watch: {}
}
</script>

<style scoped lang="less"></style>

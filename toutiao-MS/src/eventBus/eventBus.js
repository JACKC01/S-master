// 中央总线的封装
export default {
  install: function (Vue) {
    const bus = new Vue({
      methods: {
        emit (event, ...args) {
          this.$emit(event, ...args)
        },
        on (event, cb) {
          this.$on(event, cb)
        },
        off (event, cb) {
          this.$off(event, cb)
        }
      }
    })
    Vue.prototype.$bus = bus
  }
}

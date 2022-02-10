<template>
  <div class="login-container">
    <el-form
      :model="loginForm"
      status-icon
      :rules="loginRules"
      ref="loginForm"
      label-width="65px"
      class="login-rule-form"
    >
      <div class="login-title">
        <span>仿今日头条后台管理系统</span>
      </div>
      <el-form-item label="手机号" prop="mobile">
        <el-input
          autocomplete
          v-model="loginForm.mobile"
          @keyup.enter.native="onHandleLogin"
        ></el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="code">
        <el-input
          autocomplete="off"
          v-model="loginForm.code"
          @keyup.enter.native="onHandleLogin"
        ></el-input>
      </el-form-item>
      <el-checkbox v-model="checked">记住我&nbsp;</el-checkbox>
      <el-tooltip
        effect="light"
        content="点击记住我并且登录成功后,下次登录时会自动填充账号密码"
        placement="top-start"
      >
        <i class="el-icon-question"></i>
      </el-tooltip>
      <el-form-item prop="isAgree" label-width="0px">
        <el-checkbox v-model="loginForm.isAgree">我已同意相关条款</el-checkbox>
      </el-form-item>
      <div class="btn-container">
        <el-form-item ref="btn" label-width="5px">
          <el-button type="primary" @click="onHandleLogin" :loading="isLogin">{{
            isLogin ? '登录中' : '登录'
          }}</el-button>
        </el-form-item>
        <el-form-item ref="btn" label-width="5px">
          <el-button>注册</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
// 加密包
import CryptoJS from 'crypto-js'
export default {
  name: 'Login',
  data () {
    const checkIsAgree = (rule, value, callback) => {
      if (!value) {
        callback(new Error('您还没有勾选相关条款'))
      } else {
        callback()
      }
    }
    return {
      //  登录表单的数据
      loginForm: {
        mobile: '13911111111',
        code: '246810',
        isAgree: false
      },
      //  校验规则
      loginRules: {
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          {
            pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
            message: '手机号格式不对',
            trigger: 'blur'
          }
        ],
        code: [
          { required: true, message: '验证码不能为空', trigger: 'blur' },
          {
            pattern: /^\d{6}$/,
            message: '验证码必须为6位数字',
            trigger: 'blur'
          }
        ],
        isAgree: [{ validator: checkIsAgree, trigger: 'change' }]
      },
      //  是否记住密码
      checked: false,
      //  后端返回的用户信息
      userInfo: null,
      // 是否处于登录状态
      isLogin: false
    }
  },
  //  页面加载调用获取cookie值
  created () {
    this.getCookie()
  },
  methods: {
    ...mapMutations(['setUser']),
    ...mapActions(['onLogin']),
    //  处理用户登录
    onHandleLogin () {
      // 先看用户有没有网
      if (!window.navigator.onLine) {
        return this.$message.error('您还没有网络哦')
      } else {
        this.isLogin = true
        this.$refs.loginForm.validate((flag, obj) => {
          if (!flag) {
            const errorKeys = Object.keys(obj)
            const errorMessage = obj[errorKeys[0]][0].message
            if (errorMessage) {
              this.$message.error(errorMessage)
            } else {
              this.$message.error('请根据提示输入正确的信息')
            }
            this.isLogin = false
          } else {
            this.login()
          }
        })
      }
    },
    // 表单校验成功登录操作
    async login () {
      try {
        await this.onLogin(this.loginForm)
        this.$message.success('登录成功')
        this.$router.push('/layout/home')
        //  判断复选框是否被勾选 勾选则调用配置cookie方法
        if (this.checked === true) {
          //  传入账号名，密码，和保存天数3个参数
          this.setCookie(this.loginForm.mobile, this.loginForm.code, 7)
        } else {
          //  清空Cookie
          this.clearCookie()
        }
        this.isLogin = false
      } catch (error) {
        const { response } = error
        if (response && response.status === 400) {
          this.$message.error('手机号或验证码不对')
        } else if (response && response.status === 403) {
          this.$message.error('权限不足无法登录')
        } else if (response && response.status === 507) {
          this.$message.error('数据异常')
        } else {
          // 处理其他异常
        }
        this.isLogin = false
      }
    },
    //  设置cookie
    setCookie (mobile, code, exdays) {
      // 使用CryptoJS方法加密
      const pwdCode = CryptoJS.AES.encrypt(code, 'secret key 123')
      var exdate = new Date() //  获取时间
      exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays) //  保存的天数
      // 字符串拼接cookie
      window.document.cookie =
        'mobile' + '=' + mobile + ';path=/;expires=' + exdate.toGMTString()
      window.document.cookie =
        'code' + '=' + pwdCode + ';path=/;expires=' + exdate.toGMTString()
    },
    //  读取cookie
    getCookie: function () {
      if (document.cookie.length > 0) {
        var arr = document.cookie.split('; ') // 这里显示的格式需要切割一下自己可输出看下
        for (var i = 0; i < arr.length; i++) {
          var arr2 = arr[i].split('=') // 再次切割
          // 判断查找相对应的值
          if (arr2[0] === 'mobile') {
            this.loginForm.mobile = arr2[1] // 保存到保存数据的地方
          } else if (arr2[0] === 'code') {
            // 拿到拿到加密后的密码arr2[1]并解密
            var bytes = CryptoJS.AES.decrypt(
              arr2[1].toString(),
              'secret key 123'
            )
            // 拿到解密后的密码（登录时输入的密码）
            var plaintext = bytes.toString(CryptoJS.enc.Utf8)
            this.loginForm.code = plaintext
          }
        }
      }
    },
    // 清除cookie
    clearCookie: function () {
      this.setCookie('', '', -1) // 修改2值都为空，天数为负1天就好了
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  background-image: url('~assets/images/login/login.jpg');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  //  background-position:center;
  //  background-attachment:fixed;
  height: 100%;
  position: relative;
  .el-form {
    width: 400px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    border-radius: 20px;
    padding: 80px;
    /deep/ .el-input__suffix {
      color: #76d927;
    }
    .login-title {
      text-align: center;
      position: relative;
      top: -40px;
      letter-spacing: 5px;
      font-size: 20px;
    }
    .btn-container {
      margin-top: 30px;
    }
    .el-button {
      width: 100%;
    }
    .el-form-item:last-child {
      text-align: center;
      margin-left: unset;
      margin-bottom: 0;
    }
  }
}
</style>

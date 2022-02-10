const path = require('path');//引入path模块
function resolve(dir){
    return path.join(__dirname,dir)//path.join(__dirname)设置绝对路径
}
module.exports={
    devServer: {
        open: true      
    },
    chainWebpack:(config)=>{
        config.resolve.alias
        .set('@',resolve('./src'))
        .set('components',resolve('./src/components'))
        .set('views',resolve('src/views'))
        .set('assets',resolve('src/assets'))
        .set('network',resolve('src/network'))
        .set('common',resolve('src/common'))
        .set('utils',resolve('src/utils'))
        .set('api',resolve('src/api'))
        //set第一个参数：设置的别名，第二个参数：设置的路径
        // config.when(process.env.NODE_ENV === 'production', config => {
        //   config.entry('app').clear().add('./src/main-prod.js')
        // })
        // // 开发模式
        // config.when(process.env.NODE_ENV === 'development', config => {
        //     config.entry('app').clear().add('./src/main-dev.js') 
        // })
　　　　
    },
}
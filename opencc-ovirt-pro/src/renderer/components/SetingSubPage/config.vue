<template>
  <div style="padding-top:20px ;padding-left:40px">
    <el-checkbox @change="changeFullScreenValue" v-model="full_screen_checked"
      >全屏进入虚拟机</el-checkbox
    >
  </div>
</template>

<script>
const configipc = require('electron').ipcRenderer // 定义信号与槽函数接收者

export default {
  name: 'seting-config-page',
  data() {
    return {
      full_screen_checked: true,
    }
  },
  methods: {
    changeFullScreenValue() {
      console.log('this.full_screen_checked', this.full_screen_checked)
      configipc.send('config:set_full_screen_value', this.full_screen_checked)
    },
  },
  mounted() {
    configipc.send('config:get_full_screen_value') //获取配置文件数据

    let get_full_screen_fun = (channel, args) => {
      this.full_screen_checked = args['data']['full_screen_value']
    }

    configipc.on('config:get_full_screen_value_bak', get_full_screen_fun)
  },
  destroyed() {
    configipc.removeAllListeners('config:get_full_screen_value_bak')
  },
}
</script>

<style scoped></style>

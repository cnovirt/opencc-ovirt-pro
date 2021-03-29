<template>
  <el-container>
    <el-header>
      <el-input
        class="hosts-ip"
        v-model="hosts.host_ip"
        placeholder="输入域名IP地址"
        @keydown.enter.native="enterAddHosts"
        :disabled="HostIpDisable"
      >
      </el-input>
      <el-input
        class="hosts-ip"
        v-model="hosts.host_name"
        placeholder="输入域名"
        @keydown.enter.native="enterAddHosts"
        :disabled="HostNameDisable"
      ></el-input>
      <el-button
        class="hosts-btn"
        :disabled="commitBtnDisable"
        type="primary"
        @click="button_add_hosts"
        >{{ btnAddMsg }}
      </el-button>
    </el-header>

    <el-main>
      <el-table
        height="380"
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column prop="num" label="序号" width="100"></el-table-column>
        <el-table-column
          prop="host_ip"
          label="IP地址"
          width="200"
        ></el-table-column>
        <el-table-column
          prop="host_name"
          label="域名"
          width="200"
        ></el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              @click="deleteRow(scope.$index, tableData)"
              >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>

<script>
const hostsipc = require('electron').ipcRenderer // 定义信号与槽函数接收者
export default {
  name: 'seting-hosts-page',
  components: {},
  data() {
    return {
      tableData: [
        // { num: '1', host_ip: '192.168.8.111', host_name: 'host.com'},
      ],
      hosts: {
        host_ip: '',
        host_name: '',
      },
      btnAddMsg: '添加域名',
      commitBtnDisable: false, // 禁用添加中心按钮
      HostIpDisable: false, // 禁用域名IP输入框
      HostNameDisable: false, // 禁用域名输入框
    }
  },

  mounted() {
    hostsipc.send('set_host:get_all_host') //首先要获取到后台所有域名的数据

    let get_all_host_value_fun = (channel, args) => {
      this.tableData = args.data
    }

    let add_host_value_fun = (channel, args) => {
      this.addbuttonEnable()
      if (args.status === true) {
        this.$message({
          message: '添加域名成功',
          type: 'success',
        })
        // 清除输入框数据
        this.hosts.host_ip = ''
        this.hosts.host_name = ''

        hostsipc.send('set_host:get_all_host') //成功之后重新获取一次数据
      } else {
        this.$message.error(args.error)
      }
    }

    let del_host_value_fun = (channel, args) => {
      if (args.status === false) {
        this.$message.error(args.error)
      } else {
        hostsipc.send('set_host:get_all_host') //删除成功之后重新获取一下数据
        this.$message.success('删除域名成功')
      }
    }

    hostsipc.on('set_host:get_all_host_bak', get_all_host_value_fun)
    hostsipc.on('set_host:add_host_bak', add_host_value_fun)
    hostsipc.on('set_host:del_host_bak', del_host_value_fun)
  },

  destroyed() {
    hostsipc.removeAllListeners('set_host:get_all_host_bak')
    hostsipc.removeAllListeners('set_host:add_host_bak')
    hostsipc.removeAllListeners('set_host:del_host_bak')
  },

  methods: {
    //添加按钮不可点击函数
    addbuttonDisable() {
      this.btnAddMsg = '添加中...'
      this.commitBtnDisable = true
      this.HostIpDisable = true
      this.HostNameDisable = true
    },

    //添加按钮可点击函数
    addbuttonEnable() {
      this.btnAddMsg = '添加域名'
      this.commitBtnDisable = false
      this.HostIpDisable = false
      this.HostNameDisable = false
    },

    // 检验输入函数
    checkInput() {
      if (this.hosts.host_ip == '') {
        this.$message.error('IP地址不能为空')
        return false
      }
      if (this.hosts.host_name == '') {
        this.$message.error('域名不能为空')
        return false
      }
      // 检验 - IP地址
      const reg_ip = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
      let retu_ip = reg_ip.test(this.hosts.host_ip)
      if (retu_ip === false) {
        this.$message.error('IP地址格式不正确')
        this.hosts.host_ip = ''
        return false
      }
      return true
    },

    // 表格添加一行
    button_add_hosts: function() {
      // 检验输入信息
      if (!this.checkInput()) {
        this.addbuttonEnable()
        return false
      }
      let hostsvalue = {
        host_ip: this.hosts.host_ip,
        host_name: this.hosts.host_name,
      }
      hostsipc.send('set_host:add_host', hostsvalue)
      this.addbuttonDisable()
    },

    // 删除表格行
    deleteRow(index, rows) {
      this.$confirm('确认是否删除该条记录？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消',
      }).then(() => {
        let host_dic = {
          host_ip: this.tableData[index]['host_ip'],
          host_name: this.tableData[index]['host_name'],
        }
        hostsipc.send('set_host:del_host', host_dic)
      })
    },
    // 回车事件 - 域名(IP/域名)输入框
    enterAddHosts() {
      this.button_add_hosts()
    },
  },
}
</script>

<style scoped>
.el-header {
  padding-top: 20px;
}
.el-header .el-input {
  margin: 0 10px;
}
.hosts-ip {
  width: 200px;
}
.hosts-hostsaddr {
  width: 100px;
}
</style>

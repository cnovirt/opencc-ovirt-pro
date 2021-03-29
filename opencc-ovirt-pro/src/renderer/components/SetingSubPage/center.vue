<template>
  <el-container>
    <el-header>
      <span>IP</span>
      <el-input
        class="center-ip"
        v-model="center.center_ip"
        placeholder="中心地址"
        @keydown.enter.native="enterAddCenter"
        :disabled="commintInputDisable"
      ></el-input>

      <span>端口</span>
      <el-input
        class="center-port"
        v-model="center.center_port"
        placeholder="端口号"
        @keydown.enter.native="enterAddCenter"
        :disabled="commintInputDisable"
      ></el-input>

      <span>域</span>
      <el-input
        class="center-domain"
        v-model="center.center_domain"
        placeholder="添加域"
        @keydown.enter.native="enterAddCenter"
        :disabled="commintInputDisable"
      ></el-input>
      <el-button
        class="center-btn"
        :disabled="commitBtnDisable"
        type="primary"
        @click="button_add_center"
        >{{ btnAddMsg }}</el-button
      >
    </el-header>

    <el-main>
      <el-table height="400" :data="tableData" style="width: 100%">
        <el-table-column
          prop="center_num"
          label="序号"
          align="center"
          width="50"
        >
        </el-table-column>
        <el-table-column prop="center_ip" label="IP地址" align="center">
        </el-table-column>
        <el-table-column
          prop="center_port"
          label="端口"
          align="center"
          width="80"
        >
        </el-table-column>
        <el-table-column prop="center_domain" label="域" align="center">
          <template slot-scope="scope">
            <el-form :model="scope.row">
              <el-input
                v-if="scope.row.isDomainInput"
                v-model="scope.row.center_domain"
              ></el-input>
              <span v-else>{{ scope.row.center_domain }} </span>
            </el-form>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" width="150">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEditRow(scope.$index, scope.row)"
            >
              {{ scope.row.isDomainInput ? '完成' : '编辑' }}
            </el-button>

            <el-button
              size="mini"
              type="danger"
              @click="handleDeleteRow(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>

<script>
// import vCenterTable from './vCenterTable'

const centeripc = require('electron').ipcRenderer // 定义信号与槽函数接收者

export default {
  name: 'seting-center-page',
  components: {
    // vCenterTable
  },
  data() {
    return {
      tableData: [
        // { center_num: '1', center_ip: '192.168.8.111', center_port: '443', domain: 'internal', isDomainInput: false, },
      ],
      center: {
        center_ip: '',
        center_port: '443',
        center_domain: 'internal',
      },
      btnAddMsg: '添加中心',
      commitBtnDisable: false, // 禁用添加中心按钮
      commintInputDisable: false, // 禁用 IP / Port / Domain 输入框
    }
  },
  methods: {
    // 添加按钮不可点击函数
    addbuttonDisable() {
      this.btnAddMsg = '添加中...'
      this.commitBtnDisable = true
      this.commintInputDisable = true
    },

    // 添加按钮可点击函数
    addbuttonEnable() {
      this.btnAddMsg = '添加中心'
      this.commitBtnDisable = false
      this.commintInputDisable = false
    },

    // 检验输入函数
    checkInput() {
      if (this.center.center_ip.trim() === '') {
        this.$message.error('IP地址不能为空')
        return false
      }
      if (this.center.center_port.trim() === '') {
        this.$message.error('端口号不能为空')
        return false
      }
      if (this.center.center_domain.trim() === '') {
        this.$message.error('域不能为空')
        return false
      }

      // 检验 - IP地址
      const reg_ip = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
      let retu_ip = reg_ip.test(this.center.center_ip)
      if (retu_ip) {
        // this.$message.success('正确IP地址')
      } else {
        this.$message.error('错误IP地址')
        this.center.center_ip = ''
        return false
      }

      // 检验 - 端口号
      const reg_port = /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/
      let retu_port = reg_port.test(this.center.center_port)
      if (retu_port) {
        // this.$message.success('正确端口号')
      } else {
        this.$message.error('错误端口号')
        this.center.center_port = ''
        return false
      }
      return true
    },

    // 表格添加一行
    button_add_center: function() {
      this.addbuttonDisable() // 输入框禁用
      // 检验输入信息
      if (!this.checkInput()) {
        this.addbuttonEnable() // 输入框启用
        return false
      }
      let center_value = {
        centerip: this.center.center_ip,
        centerport: this.center.center_port,
        centerdomain: this.center.center_domain,
      }
      centeripc.send('center:add_center', center_value)
    },

    // 删除表格一行
    handleDeleteRow(index, row) {
      console.log('handleDeleteRow', index, row)
      this.$confirm('确认是否删除该条记录？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消',
      }).then(() => {
        centeripc.send('center:del_center', row.center_ip)
      })
    },

    // 修改表格域控
    handleEditRow(index, row) {
      console.log('handleEditRow', index, row)
      if (row.isDomainInput === false) {
        row.isDomainInput = !row.isDomainInput
        return true
      } else {
        row.isDomainInput = !row.isDomainInput
      }
      centeripc.send('center:add_domain', row)
    },

    // 回车事件 - IP输入框, 端口输入框
    enterAddCenter() {
      this.button_add_center()
    },
  },

  mounted() {
    centeripc.send('center:get_all_center') //首先要获取到后台所有中心的数据

    let get_all_center_fun = (channel, args) => {
      this.tableData = []
      for (let index in args['data']) {
        this.tableData.push({
          center_num: parseInt(index) + 1,
          center_ip: args['data'][index]['centerip'],
          center_port: args['data'][index]['centerport'],
          center_domain: args['data'][index]['centerdomain'],
          isDomainInput: false,
        })
      }
    }

    let add_center_fun = (channel, args) => {
      if (args['status'] === false) {
        this.$message.error(args['error'])
        this.addbuttonEnable()
        return
      } else {
        centeripc.send('center:get_all_center')
        this.center.center_ip = ''
        this.$message.success('添加中心成功')
      }
      this.addbuttonEnable()
      centeripc.send('center:get_all_center') // 获取中心数据
    }

    let del_center_fun = (channel, args) => {
      centeripc.send('center:get_all_center') // 获取中心数据

      // this.tableData = []
      // for (let i = 0; i < args['data'].length; i++) {
      //   let center_ip = args['data'][i]['centerip']
      //   let center_port = args['data'][i]['centerport']
      //   let center_domain = args['data'][i]['centerdomain']

      //   this.tableData.push({
      //     center_num: parseInt(i) + 1,
      //     center_ip: center_ip,
      //     center_port: center_port,
      //     center_domain: center_domain,
      //     isDomainInput: false,
      //   })
      // }
    }

    let add_domain_fun = (channel, args) => {
      if (args.status === true) {
        this.$message.success('修改域成功')
      } else {
        this.$message.error(args.error)
      }
    }

    centeripc.on('center:del_center_bak', del_center_fun)
    centeripc.on('center:add_center_bak', add_center_fun)
    centeripc.on('center:get_all_center_bak', get_all_center_fun)
    centeripc.on('center:add_domain_bak', add_domain_fun)
  },

  destroyed() {
    centeripc.removeAllListeners('center:del_center_bak')
    centeripc.removeAllListeners('center:add_center_bak')
    centeripc.removeAllListeners('center:get_all_center_bak')
    centeripc.removeAllListeners('center:add_domain_bak')
  },
}
</script>

<style scoped>
/* .el-table{
  border: 1px solid pink;
} */
.el-header {
  padding-top: 20px;
}
.el-header > span {
  /* font-size: 10px; */
  color: rgba(0, 0, 0, 0.7);
  margin-left: 10px;
}
.el-header .el-input {
  margin: 0 5px;
}

.center-ip {
  width: 150px;
}
.center-port {
  width: 80px;
}
.center-domain {
  width: 150px;
}
</style>

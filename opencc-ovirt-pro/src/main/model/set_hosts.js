/*
  create by zero_wangdu for : 添加中心功能的所有函数
 */
const os = require('os')
const hostTool = require('./common/hosts_tool')

const { ipcMain } = require('electron')
const g_common = require('./common/commoninfo')

let HOST_PATH = ''
if (os.platform() == 'win32') {
  HOST_PATH = 'C:\\Windows\\System32\\drivers\\etc\\hosts'
} else {
  HOST_PATH = '/etc/hosts'
}

// 获取所有域名信息
ipcMain.on('set_host:get_all_host', (data, args) => {
  let retuData = { status: true, data: '', error: '' }
  let hostList = hostTool.get_all_host()
  for (let index in hostList) {
    hostList[index]['num'] = parseInt(index) + 1
  }
  retuData.data = hostList
  g_common.mainwindow.webContents.send('set_host:get_all_host_bak', retuData)
})

//添加域名
ipcMain.on('set_host:add_host', (data, args) => {
  console.log('add-host:args', args)
  let retuData = { status: false, data: '', error: '' }

  let retu = hostTool.add_host(args.host_ip.trim(), args.host_name.trim())
  if (retu) {
    retuData.status = true
    retuData.error = '域名添加成功'
  } else {
    retuData.error = 'IP地址/域名已存在'
  }
  g_common.mainwindow.webContents.send('set_host:add_host_bak', retuData)
})

//删除域名
ipcMain.on('set_host:del_host', (data, args) => {
  console.log('del-host:args:', args)

  let retuData = { status: false, data: '', error: '' }
  let retu = hostTool.del_host(args.host_ip, args.host_name)
  if (retu) {
    retuData.status = true
    retuData.error = '域名删除成功'
  } else {
    retuData.error = '域名删除失败'
  }

  g_common.mainwindow.webContents.send('set_host:del_host_bak', retuData)
})

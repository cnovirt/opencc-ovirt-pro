/*
  create by zero_wangdu for : 添加高级配置页面
 */

const { ipcMain } = require('electron')
const g_common = require('./common/commoninfo')
import myconfigure from './common/myconfigure'

// 获取全屏进入虚拟机参数
ipcMain.on('config:get_full_screen_value', (channel, args) => {
  console.log('config:get_full_screen_value', args)
  let full_screen_value = true
  let jv = myconfigure.get_value('full_screen_checked')
  if (jv === undefined) {
    full_screen_value = true
    myconfigure.update_value('full_screen_checked', full_screen_value)
  } else {
    full_screen_value = jv
  }

  let retuData = {
    data: { full_screen_value: full_screen_value },
    status: true,
    error: '',
  }
  g_common.mainwindow.webContents.send(
    'config:get_full_screen_value_bak',
    retuData
  )
})

// 设置全屏进入虚拟机参数
ipcMain.on('config:set_full_screen_value', (channel, args) => {
  console.log('config:set_full_screen_value', args)
  let retuData = { data: '', status: false, error: '' }

  myconfigure.update_value('full_screen_checked', args)

  g_common.mainwindow.webContents.send(
    'config:set_full_screen_value_bak',
    retuData
  )
})

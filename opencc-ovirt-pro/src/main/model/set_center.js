/*
  create by zero_wangdu for : 添加中心功能的所有函数
 */

import my_ovirt_api from './ovirtapi/my_ovirt_api'

const { ipcMain } = require('electron')
const fss = require('fs')
const g_common = require('./common/commoninfo')
import myconfigure from './common/myconfigure'

require('./common/commoninfo')
require('./common/globel_value')

//获取所有中心信息
ipcMain.on('center:get_all_center', (channel, args) => {
  let center_info = []
  let jv = myconfigure.get_value('centerinfo')
  if (jv === undefined) {
    center_info = []
  } else {
    center_info = jv
  }

  let retuData = { data: center_info, status: true, error: '' }
  g_common.mainwindow.webContents.send('center:get_all_center_bak', retuData)
})

//添加中心功能
ipcMain.on('center:add_center', (channel, args) => {
  console.log('center:add_center', args)
  let retuData = { data: '', status: false, error: '' }

  let center_info = []
  let jv = myconfigure.get_value('centerinfo')
  if (jv === undefined) {
    center_info = []
  } else {
    center_info = jv
    // 判断ip是否存在
    for (let i = 0; i < center_info.length; i++) {
      let item = center_info[i]
      let centerip = item['centerip']
      if (args['centerip'] === centerip) {
        retuData.error = '该中心地址已经存在'
        g_common.mainwindow.webContents.send('center:add_center_bak', retuData)
        return
      }
    }
  }
  // 判断中心是否是ovirt中心
  let center_ip_port = args['centerip'] + ':' + args['centerport']
  let request_retu = my_ovirt_api.CHECK_IS_OVIRT_ENGINE(center_ip_port)
  request_retu
    .catch((err) => {
      retuData.error = '添加中心失败,该地址不是ovirt管理服务地址'
      g_common.mainwindow.webContents.send('center:add_center_bak', retuData)
      return
    })
    .then((res) => {
      console.log('CHECK_IS_OVIRT_ENGINE:', res.data)
      if (res.status === 200) {
        // 添加中心, 保存到配置文件
        center_info.push(args)
        myconfigure.update_value('centerinfo', center_info)

        retuData.status = true
        g_common.mainwindow.webContents.send('center:add_center_bak', retuData)
      } else {
        retuData.error = '添加中心失败,中心地址认证错误'
        g_common.mainwindow.webContents.send('center:add_center_bak', retuData)
      }
    })
})

//删除中心信息
ipcMain.on('center:del_center', (channel, args) => {
  let retuData = { data: '', status: false, error: '' }

  let loginstatusdata = myconfigure.get_value('loginstatusdata') //获取到自动登录的中心信息,如果存在删除的情况则也需要删除

  let center_info = []
  let jv = myconfigure.get_value('centerinfo')
  if (jv === undefined) {
    center_info = []
  } else {
    center_info = jv
    // 判断中心是否已经存在
    for (let i = 0; i < center_info.length; i++) {
      let item = center_info[i]
      let centerip = item['centerip']
      if (args === centerip) {
        // 如果登录信息中存在, 就清空登录信息
        if (
          loginstatusdata != undefined &&
          loginstatusdata['centerip'] === centerip
        ) {
          myconfigure.update_value('loginstatusdata', {})
        }
        // 删除中心
        center_info.splice(i, 1)
        break
      }
    }
  }

  myconfigure.update_value('centerinfo', center_info)
  retuData = { data: center_info, status: true, error: '' }
  g_common.mainwindow.webContents.send('center:del_center_bak', retuData)
})

ipcMain.on('center:add_domain', (channel, args) => {
  console.log('center:add_domain', args)
  let retuData = { data: '', status: false, error: '' }

  let center_info = []
  let jv = myconfigure.get_value('centerinfo')
  if (jv === undefined) {
    center_info = []
  } else {
    center_info = jv
    // 判断ip是否存在
    for (let i = 0; i < center_info.length; i++) {
      let item = center_info[i]
      if (args.center_ip === item['centerip']) {
        center_info[i].centerdomain = args.center_domain
        myconfigure.update_value('centerinfo', center_info)

        retuData.status = true
        g_common.mainwindow.webContents.send('center:add_domain_bak', retuData)
        return
      }
    }
    retuData.error = '域修改失败,数据不存在'
    g_common.mainwindow.webContents.send('center:add_domain_bak', retuData)
  }
})

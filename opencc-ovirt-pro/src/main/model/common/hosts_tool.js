const fs = require('fs')
const os = require('os')

let HOST_PATH = ''
if (os.platform() == 'win32') {
  HOST_PATH = 'C:\\Windows\\System32\\drivers\\etc\\hosts'
} else {
  HOST_PATH = '/etc/hosts'
}

const host_tool = Object()

// 获取host列表
host_tool.get_all_host = () => {
  let host_text = fs.readFileSync(HOST_PATH).toString()
  let host_lines = host_text.split('\n')

  let hostData = []
  for (let index in host_lines) {
    let item = host_lines[index] // 获取其中一个
    item = item.trim().replace(/\s+/g, ' ') // 去除两边空格,将多个空格转成一个空格

    if (item.indexOf('::') >= 0) {
      continue
    } else if (item === '') {
      continue
    } else if (item.indexOf('#') >= 0) {
      continue
    } else {
      let item_v = {
        host_ip: item.split(' ')[0],
        host_name: item.split(' ')[1],
      }
      hostData.push(item_v)
    }
  }
  return hostData
}

// 判断域名是否存在
host_tool.exists_host = (host_ip, host_name) => {
  let host_li = host_tool.get_all_host()
  for (let index in host_li) {
    let host_dic = host_li[index]
    if (host_dic.host_ip == host_ip) {
      if (host_dic.host_name == host_name) {
        return true
      }
    }
  }
  return false
}

// 添加域名
host_tool.add_host = (host_ip, host_name) => {
  let key = host_tool.exists_host(host_ip, host_name)
  if (key == false) {
    let host_text = fs.readFileSync(HOST_PATH).toString()
    host_text = host_text.concat('\n', host_ip, ' ', host_name)
    let fp = fs.openSync(HOST_PATH, 'w')
    fs.writeSync(fp, host_text)
    fs.closeSync(fp)

    return true
  } else {
    return false
  }
}

// 删除域名
host_tool.del_host = (host_ip, host_name) => {
  let ip_host = host_ip + host_name
  let key = host_tool.exists_host(host_ip, host_name)
  if (key) {
    let host_text = fs.readFileSync(HOST_PATH).toString()

    let host_lines = host_text.split('\n')

    let all_v = ''
    for (let index in host_lines) {
      let item = host_lines[index]
      let line_item = item.replace(' ', '')
      if (line_item == ip_host) {
        continue
      } else {
        if (item == '') {
          continue
        }
        all_v = all_v.concat('\n', item.trim().replace(/\s+/g, ' '))
      }
    }
    let fp = fs.openSync(HOST_PATH, 'w')
    fs.writeSync(fp, all_v)
    fs.closeSync(fp)

    return true
  } else {
    return false
  }
}

module.exports = host_tool

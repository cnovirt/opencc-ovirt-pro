//此文件编写http请求客户端代码

const axios = require('axios')
const https = require('https')
const qs = require('qs')

const request_api = (dict_args) => {
  let args_data = null
  if (typeof dict_args.data === 'string') {
    args_data = dict_args.data
  } else {
    args_data = qs.stringify(dict_args.data)
  }

  let myAxiosConfig = {
    url: dict_args['url'],
    method: dict_args['method'],
    headers: dict_args['headers'],
    data: args_data,

    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
      keepAlive: true,
    }),
  }
  axios.defaults.timeout = 30000

  return axios.request(myAxiosConfig)
}

// 函数导出, 测试接口时,请注释
export { request_api }

// ======> 测试接口
// dict_args = {
//   method: 'post',
//   url: 'https://192.168.16.230:443/ovirt-engine/sso/oauth/token',
//   headers: {
//     'Content-Type': 'application/x-www-form-urlencoded',
//     Accept: 'application/json',
//   },
//   data: {
//     grant_type: 'password',
//     // 'username': 'xiaoli@ldap-server.com', // 域控用户
//     // 'password': '123456',
//     username: 'admin@internal',
//     password: 'admin=12',
//     scope: 'ovirt-app-api',
//   },
// }
// request_retu = request_api(dict_args)
// request_retu.then((res) => {
//   console.log(res.data)
// })

// ======> 返回数据
/*
{ access_token:
   'gGi72b2udHR2repRGWMzOhOJy5CVIboNoQLTDzYXGXOxwg7kOIqFPJZ-1UE83wJqu7vNWsueONY9Wfea0XiIfw',
  scope:
   'ovirt-app-api ovirt-ext=token-info:authz-search ovirt-ext=token-info:public-authz-search ovirt-ext=token-info:validate ovirt-ext=token:password-access',
  exp: '1617588406000',
  token_type: 'bearer' }
  */

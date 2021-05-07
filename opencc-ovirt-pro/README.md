# opencc-client

> 面向企业用户的 oVirt 开源云桌面客户端，拥有企业级交互 UI 设计。
>
> 目前支持 :
>
> - Windows 系统版本
> - Ubuntu 系统版本(Debian 开源系统)

## 代码运行

```bash
# 可以选用功能 npm 公共库
npm config set registry https://registry.npm.taobao.org

# 使用最高权限安装依赖, 如果网络导致下载失败, 可以使用 yarn 安装
npm install

# 使用最高权限运行代码
npm run dev
```

## 打包运行

```bash
# 可以选用功能 npm 公共库,
npm config set registry https://registry.npm.taobao.org

# 安装依赖, 如果网络导致下载失败, 可以使用 yarn 安装
npm install

# 打包成可执行文件
sudo npm run build:client

# ubuntu 版本 : 进入build文件夹, 使用 root 权限运行
sudo npm run build:linux
# 安装VirtViewer客户端 :
sudo apt install virt-viewer -y

# windows 版本 : 进入build文件夹, 使用管理员权限运行客户端
npm run build:win32

# 清除打包文件
npm run build:clean
```

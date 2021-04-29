# opencc-ovirt-pro

## 介绍

面向企业用户的 oVirt 开源云桌面客户端 windows 版本，拥有企业级交互 UI 设计。

目前支持系统本版 :

- Windows 系统版本
- Ubuntu 系统版本(Debian 开源系统)

## 环境配置

1. 官网下载安装 `nodejs` : <http://nodejs.cn/>

2. 官网下载安装 `git` : <https://git-scm.com/>

3. 下载安装 `virt-virter` : <https://www.spice-space.org/download.html>

   下载对应本版的客户端

   - windows 客户端安装后, 将 VirtViewer 文件夹拷贝到 opencc-ovirt-pro 工程文件夹内, 可以打开 oVirt 虚拟机 (代码库中提供精简的 VirtViewer 客户端)
   - ubuntu 客户端, 命令行安装 `sudo apt install virt-viewer -y`

4. 使用管理员权限打开 `cmd.exe` 或 root 权限打开终端

```bash
# 克隆代码并进入项目目录
git clone https://gitee.com/cnovirt/opencc-ovirt-pro-win.git
cd opencc-ovirt-pro-win/opencc-ovirt-pro

# 安装依赖, 可以使用淘宝公共库
npm config set registry https://registry.npm.taobao.org
npm install # 如果网络导致下载失败, 可以使用 yarn 安装
```

## 代码运行

```bash
cd opencc-ovirt-pro-win/opencc-ovirt-pro
npm run dev
```

## 打包运行

### Windows 打包

```bash
# 编译代码
cd opencc-ovirt-pro-win/opencc-ovirt-pro
npm run build:win32

# 运行成功后, 在 ./build 目录下生成打包的工程
# 将 VirtViewer 文件夹拷贝到打包出来的工程文件夹中, 使用管理权限运行客户端

# 或直接使用脚本打包
# win_build_client_script.bat : windows打包脚本
# zip_opencc_ovirt_pro.nsi : nsis压缩安装脚本, 需要配置nsis环境

# 清除打包文件
npm run build:clean
```

### Ubuntu 打包

```bash
# 最好使用 root 权限
cd opencc-ovirt-pro-win/opencc-ovirt-pro

# 打包成文件夹
sudo npm run build:linux
# 打包成可执行程序
sudo npm run build:client

# 安装 virt-viewer 客户端
sudo apt instal virt-viewer -y
# 检查是否安装成功, 是否启动客户端
remote-viewer

# 进入 ./build 目录, root 权限运行客户端

# 清除打包文件
npm run build:clean
```

# opencc-client

> 面向企业用户的 oVirt 开源云桌面客户端，拥有企业级交互 UI 设计。
>
> 目前支持 :
>
> - Windows 系统版本
> - Ubuntu 系统版本(Debian 开源系统)

## 代码运行

```bash
# 可以选用功能 npm 公共库,
npm config set registry https://registry.npm.taobao.org

# 安装依赖, 如果网络导致下载失败, 可以使用 yarn 安装
npm install

# 运行代码
npm run dev
```

## 打包运行

```bash
# 可以选用功能 npm 公共库,
npm config set registry https://registry.npm.taobao.org

# 安装依赖, 如果网络导致下载失败, 可以使用 yarn 安装
npm install

# ubuntu 版本 : 最好使用 root 权限
# 打包成文件夹
sudo npm run build:linux
# 打包成可执行文件
sudo npm run build:client

# windows 版本 : 使用管理员权限打开 cmd.exe
npm run build:win32

# 或直接使用脚本打包
# win_build_client_script.bat : windows打包脚本
# zip_opencc_ovirt_pro.nsi : nsis压缩安装脚本, 需要配置nsis环境

# 进入 ./build 目录, 使用管理员或root权限运行打包的工程
# windows将 VirtViewer 文件夹拷贝到打包出来的工程文件夹中, 可以打开虚拟机
# ubuntu命令行安装客户端 :
sudo apt install virt-viewer -y

# 清除打包文件
npm run build:clean
```

@echo off

:: del /p aaa.exe  /p 参数询问是否删除

echo "del opencc-ovirt-pro.exe ..."
del opencc-ovirt-pro-v*-x86.exe
echo "del opencc-ovirt-pro.exe success"

echo "git pull ..."
git pull
echo "git pull success"

echo "build client ..."
::set startDir=%cd%
cd opencc-ovirt-pro
call npm run build:clean
call npm run build:win32
cd ..
echo "build client success"

echo "copy VirtViewer ..."
:: 拷贝文件夹不加符号 \ 
:: 拷贝文件夹里面内容需要加符合 \*
:: 拷贝的目标文件, 最后是文件夹需要符合 \ 
:: /f 参数: 复制文件且保持目录结构
xcopy .\VirtViewer .\opencc-ovirt-pro\build\opencc-ovirt-pro-win32-x64\VirtViewer\ /s /e /c /y /h /r
echo "copy VirtViewer success"

pause
@echo off

call set_Sophon_env.bat

echo ==    Dont close Window while MySQL is running                               ==
echo ==    MySQL is trying to start                                               ==
echo ==    Please wait  ...                                                       ==
echo ==    MySQL is starting with configration:                                   ==
echo ==        Sophon-mysql\mysql\my.ini                                    ==
echo ===============================================================================

Sophon_mysql\bin\mysqld --defaults-file=Sophon_mysql\my.ini --standalone --console

if errorlevel 1 goto error
goto finish

:error

:finish

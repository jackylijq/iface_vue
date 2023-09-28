#!/bin/bash

sed -i "s/opt/tmp/g" /etc/screenrc;

#screen -L -t iftest -mdS starter python3 /home/git_source/iface_test/starter.py;
echo "进行代码更新"
git pull

echo "进行服务杀死，执行 ps -ef|grep python | grep $2 | cut -c 9-15|xargs kill -9";

#screen -S starter -X quit;
#ps -ef|grep python | grep $2 | cut -c 9-15|xargs kill -9;
#ps -ef|grep python | grep yarn | cut -c 9-15|xargs kill -9;
ps -ef| grep yarn | cut -c 9-15|xargs kill -9

echo "进行日志清理操作";

echo "" > /tmp/qtp_web.log;

echo "执行source操作，source /etc/profile";
#source /etc/profile
source /etc/profile.d/node.sh

echo "进行重启......";

#screen -L -t iftest -mdS starter python3 starter.py;
#nohup yarn serve > /tmp/qtp_web.log 2>&1 &
yarn build

echo "重启完成......"

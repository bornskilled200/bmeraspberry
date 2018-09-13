#!/bin/bash

if [ $# -ne 1 ]; then
  echo "$0 <start|restart|stop|status>"
  exit 1
fi


start ()
{
  nohup npm start 2> nohup.err &
}

stop ()
{
  kill `cat run.pid`
}

status ()
{
  if ps -p `cat run.pid` > /dev/null
  then
    echo "BME is running"
  else
    echo "BME not running"
  fi
}


case "$1" in
  start)
    start
    ;;

  stop)
    stop
    ;;
  status)
    status
    ;;
  restart)
    stop
    start
    ;;
  *)
  echo $"Usage: $0 <start|restart|stop|status>"
  exit 1
esac

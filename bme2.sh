#! /bin/sh
# /etc/init.d/bme

### BEGIN INIT INFO
# Provides:          noip
# Required-Start:    $local_fs $network
# Required-Stop:     $local_fs $network
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: Simple script to start a program at boot
# Description:       A simple script from www.stuffaboutcode.com which will start / stop a program a boot / shutdown.
### END INIT INFO

# If you want a command to always run, put it here

# Carry out specific functions when asked to by the system
case "$1" in
  start)
    echo "Starting bme"
    cd /home/pi/bmeraspberry
    # run application you want to start
    ./bme.sh start
    ;;
  stop)
    echo "Stopping bme"
    cd /home/pi/bmeraspberry
    # kill application you want to stop
    ./bme.sh stop
    ;;
  *)
    echo "Usage: /etc/init.d/noip {start|stop}"
    exit 1
    ;;
esac

exit 0

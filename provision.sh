#!/bin/bash

if [ $# -ne 1 ]; then
    echo "$0 <root of sd card like /e>"
    exit 1
fi

if [[ $1 != /* ]] ;
then
    echo 'needs to start with /'
    exit 1
fi

if [ ! -d "$1" ]; then
    echo "The given folder does not exist"
    exit 0
fi

if [ ! -f $1/bootcode.bin ]; then
    echo "The given folder is probably not raspberry pi's boot partition, cannot find bootcode.bin"
    exit 0
fi

cd $1

read -p "Wifi SSID: " ssid
read -s -p "Wifi Password: " password

mkdir -p etc/wpa_supplicant
echo "
country=US
ctrl_interface=/var/run/wpa_supplicant
update_config=1

network={
    ssid=\"$ssid\"
    psk=\"$password\"
    key_mgmt=WPA-PSK
}" > etc/wpa_supplicant/wpa_supplicant.conf
touch 'ssh'
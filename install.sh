#!/bin/bash

cp bme2.sh /etc/init.d/bme
sudo chmod 755 /etc/init.d/bme
sudo update-rc.d bme defaults

# to remove
# sudo update-rc.d -f  bme remove

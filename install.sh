#!/bin/bash

sudo apt-get install apt-transport-https curl
curl https://bintray.com/user/downloadSubjectPublicKey?username=bintray | sudo apt-key add -
echo "deb https://dl.bintray.com/fg2it/deb-rpi-1b jessie main" | sudo tee -a /etc/apt/sources.list.d/grafana.list
sudo apt-get update
sudo apt-get install -y cmake build-essentials postgresql postgresql-server-dev-9.6 libfontconfig grafana


# build and install timescaledb
git clone https://github.com/timescale/timescaledb.git
cd timescaledb
git checkout 0.11.0  # e.g., git checkout 0.11.0

# Bootstrap the build system
./bootstrap

# To build the extension
cd build && make

# To install
sudo make install

sed 's/.*shared_preload_libraries.*/shared_preload_libraries = '"'"'timescaledb'"'"'/' /etc/postgresql/9.6/main/postgresql.conf
sudo service postgresql restart

# setup timescaledb
read -p "postgres password: " password

sudo -u postgres psql -U postgres -d postgres -c "alter user postgres with password '$password';"

sudo -u postgres psql -U postgres -c "CREATE database tutorial;"
sudo -u postgres psql -U postgres -d tutorial -c "CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;"


sudo -u postgres psql -U postgres -d tutorial -c "CREATE USER bmewriter WITH PASSWORD 'password'; GRANT CONNECT ON DATABASE bme TO bmewriter; GRANT INSERT ON ALL TABLES IN SCHEMA public TO bmewriter"


CREATE TABLE conditions (
  time        TIMESTAMPTZ       NOT NULL,
  uptime    TEXT              NOT NULL,
  location    TEXT              NOT NULL,
  temperature DOUBLE PRECISION  NULL,
  humidity    DOUBLE PRECISION  NULL,
  air    DOUBLE PRECISION  NULL
);
SELECT create_hypertable('conditions', 'time');

read -p "grafana password: " password
curl -X PUT -H "Content-Type: application/json" -d '{
  "oldPassword": "admin",
  "newPassword": "newpass879",
  "confirmNew": "newpass879"
}' http://admin:admin@localhost:3000/api/user/password

response=`curl -X POST -H "Content-Type: application/json" -d '{
  "name":"David Park23",
  "email":"bornskilled200235@gmail.com",
  "login":"bornskilled200235@gmail.com",
  "password":"'"password"'",
  "role": "editor"
}' http://admin:newpass879@localhost:3000/api/admin/users`

user_id=`echo $response | sed 's/.*"id":\([0-9]\+\),.*/\1/'`

curl -X PATCH -H "Content-Type: application/json" -d '{
  "role": "Viewer",
}' "http://admin:admin@localhost:3000/api/org/users/$user_id"





# INSERT INTO conditions(time, location, temperature, humidity) VALUES (NOW(), 'office', 70.0, 50.0);

# SELECT * FROM conditions ORDER BY time DESC LIMIT 100;

# wget https://s3-us-west-2.amazonaws.com/grafana-releases/release/grafana_5.2.4_armhf.deb 
# sudo dpkg -i grafana_5.2.4_armhf.deb 

# sudo /bin/systemctl daemon-reload
# sudo /bin/systemctl enable grafana-server
# sudo service grafana-server start

#  CREATE USER grafanareader WITH PASSWORD 'password';
#  GRANT  CONNECT ON DATABASE bme  TO grafanareader;
#  GRANT SELECT                         ON ALL TABLES IN SCHEMA public TO grafanareader ;
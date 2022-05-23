# edge-logs-server


> A REST API for logs uploaded by Edge app clients.

#### Installation

Install Node 16 and Yarn

    curl -sL https://deb.nodesource.com/setup_16.x -o nodesource_setup.sh
    sudo bash nodesource_setup.sh
    sudo apt-get install -y nodejs

    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
    sudo apt update -y
    sudo apt install -y yarn

Install and run CouchDB v3.2.2 (use apt install process for Ubuntu 20.04)

    https://docs.couchdb.org/en/3.2.2/install/index.html

Run Yarn

    yarn && yarn prepare

Install pm2 globally

    sudo npm install pm2 -g

Install pm2 log rotation (note: the command is pm2 instead of npm)

    sudo pm2 install pm2-logrotate

#### Running Source

    yarn start

#### Launch API server and rates engine for production

    pm2 start pm2.json

#### Restart, stop, delete service

Control pm2

    pm2 stop logsServer
    pm2 restart logsServer
    pm2 delete logsServer

Launch pm2 on restart

    pm2 startup
    pm2 save

#### Monitor logs and status

    pm2 monit
    pm2 logs logsServer

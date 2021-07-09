# edge-logs-server

## Setup

Please see the [util1](https://github.com/EdgeApp/edge-utility-server#readme) docs for information on setting up CouchDB, Node.js, and so forth. This project will automatically create & manage the required databases inside of CouchDb, assuming it has access.

### Run Yarn
```
yarn
```
  

### Manage server using `pm2`


#### Install `PM2`

    sudo npm install pm2 -g

    sudo pm2 install pm2-logrotate

#### Launch server

    pm2 start pm2.json

#### `PM2` Dashboard

    pm2 monit

#### Restart, stop, delete

    Or run tasks manually,

    pm2 stop pm2.json
    
    pm2 restart pm2.json

    pm2 delete pm2.json

#### Quick Update

  If you edit the code & want to quickly execute it, just run yarn. The pm2 daemon will notice the change and automatically restart the process.
# edge-logs-server

### Manage server using `pm2`

First, install pm2 to run at startup:

```sh
yarn global add pm2
pm2 startup # Then do what it says
```

Next, tell pm2 how to run the server script:

```sh
# install:
pm2 start pm2.json
pm2 save

# check status:
pm2 monit
tail -f /var/log/logsServer.log

# manage:
pm2 restart logsServer
pm2 reload logsServer
pm2 stop logsServer
```
FROM node:12.20.0-alpine3.12

# Exposing the ports
EXPOSE 8008

# Install pm2
RUN npm install pm2 -g

# Installing log rotation
RUN pm2 install pm2-logrotate

# Set working directory to /usr/server
WORKDIR /usr/server

# Set directory 
VOLUME [ "./logs" ]

# Copy dependency files
COPY package.json .
COPY yarn.lock .

# Install and build
RUN yarn install --ignore-scripts

# Project files
COPY src src/
COPY config.json .
COPY pm2.json .

RUN yarn build.server

CMD [ "pm2-runtime", "pm2.json" ]
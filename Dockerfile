FROM node:12.20.0-alpine3.12

# Install pm2
RUN npm install pm2 -g

# Installing log rotation
RUN pm2 install pm2-logrotate

# Set working directory to /usr/server
WORKDIR /usr/server

# Set directory 
VOLUME [ "./logs" ]

# Exposing the ports
EXPOSE 8009 8009

# Copy dependency files
COPY package.json .
COPY yarn.lock .

# Install and build
RUN yarn install --ignore-scripts

# Project files
COPY src src/
COPY config.json .
COPY pm2.json .

# Build project files copied
RUN yarn build

CMD [ "pm2", "start", "pm2.json" ]
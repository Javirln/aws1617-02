FROM node:4-onbuild

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app
RUN npm install

# Bundle app source
COPY . /usr/src/app

# Set the port number as external variable
ARG PORT_NUMBER=3000
EXPOSE $PORT_NUMBER

CMD [ "npm", "start" ]

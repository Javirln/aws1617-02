FROM node:4-onbuild

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app
RUN npm install

# Bundle app source
COPY . /usr/src/app

# Set the port number, the swagger host and mongodb url as external variables
ARG PORT_NUMBER=3000
ARG SWAGGER_HOST=localhost
ARG MONGODB_URL

# Set enviroment variables
ENV PORT=$PORT_NUMBER
ENV SWAGGER_HOST=$SWAGGER_HOST
ENV MONGODB_URL=$MONGODB_URL

EXPOSE $PORT_NUMBER

CMD [ "npm", "start" ]

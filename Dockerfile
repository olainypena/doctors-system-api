# BUILD: docker build -t medi-dom-api-img .
# RUN: docker run -p 7010:7010 -d --name medi-dom-api medi-dom-api-img
# BASH: docker exec -it medi-dom-api bash

FROM node:lts
WORKDIR /opt/app

# Npm global dependencies
RUN npm i -g @nestjs/cli

## Run app
COPY . .
EXPOSE 7010
RUN npm install
RUN npm run build
CMD ["npm", "run", "start:prod"]
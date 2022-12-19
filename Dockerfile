FROM node:18-alpine AS build

ENV NODE_ENV=development
WORKDIR /source

COPY . .
RUN yarn install

CMD [ "sh", "-c", "yarn prod-start" ]

FROM node:18-alpine AS build

ENV NODE_ENV=development
WORKDIR /source

COPY . .
RUN yarn workspaces focus --production

CMD [ "sh", "-c", "yarn prod-start" ]

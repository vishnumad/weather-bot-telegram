FROM node:16-alpine AS build
ENV NODE_ENV=development
WORKDIR /source
COPY . .
RUN npm install

CMD [ "sh", "-c", "npm run start" ]

# First stage
FROM node:18-alpine AS build
ENV NODE_ENV=development
WORKDIR /source
COPY . .
RUN yarn install
RUN yarn build
# Reduce the size of node_modules to only include production dependencies
RUN rm -rf node_modules
RUN yarn workspaces focus --production

# Second stage
FROM node:18-alpine
WORKDIR /app
COPY --from=build /source/build /source/package.json /app/
COPY --from=build /source/node_modules /app/node_modules

CMD [ "sh", "-c", "NODE_ENV=production node --es-module-specifier-resolution=node index.js" ]

FROM node:16-alpine as build
WORKDIR /build
COPY ./src ./src
COPY ./package.json ./package.json
COPY ./tsconfig.json ./tsconfig.json
RUN yarn
RUN yarn build



FROM node:16-alpine as prod_modules
WORKDIR /prod_modules
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
COPY ./package.json ./package.json
RUN yarn --prod



FROM node:16-alpine
RUN apk add ttf-freefont chromium
ENV CHROMIUM_PATH /usr/bin/chromium-browser
WORKDIR /shashin
COPY ./package.json ./package.json
COPY ./default.png ./default.png
COPY --from=prod_modules /prod_modules/node_modules ./node_modules
COPY --from=build /build/dist ./dist
ENTRYPOINT yarn start

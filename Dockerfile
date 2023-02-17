FROM node:16-alpine as application
WORKDIR /app
COPY . /app/
RUN npm install
RUN npm run build:stage

# STAGE 2 make runtime IMAGE
FROM nginx
COPY --from=application /app/dist/ /usr/share/nginx/html/
COPY env/staging/nginx.conf /etc/nginx/conf.d/default.conf


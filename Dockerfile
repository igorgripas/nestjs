FROM node:14-alpine
WORKDIR /opt/app
COPY . .
RUN npm install
RUN npm run build
RUN npm prune --production
CMD ["node", "./dist/main.js"]

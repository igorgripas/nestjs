FROM node:14-alpine
WORKDIR /opt/app
COPY package.json package.json
RUN npm install
COPY . .
RUN npm run build
RUN npm prune --production
CMD ["node", "./dist/main.js"]

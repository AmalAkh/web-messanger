FROM node:lts

WORKDIR /app

COPY . .

RUN npm install 

RUN npm run build

WORKDIR /app/api

RUN npm install 

CMD ["node", "app.js"]

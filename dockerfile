FROM node:lts

WORKDIR /app

COPY . .

RUN npm install 

RUN npm run build

WORKDIR /app/api

RUN npm install 
ENV DB_HOST=db
CMD ["node", "app.js"]

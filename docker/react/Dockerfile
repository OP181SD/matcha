FROM node:18

WORKDIR /app

COPY ./frontend/package*.json ./

RUN npm install

COPY ./frontend/ .

EXPOSE 3000

CMD ["sh", "-c", "npm install && npm run build && npm start"]
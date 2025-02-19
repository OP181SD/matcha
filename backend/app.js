import express from 'express';
import cors from 'cors';
import { dbConfig } from './config/import.js';

const app = express();
const port = 5001;

app.use(cors());

app.get('/', (req, res) => {
  const method = req.method;
  const URL = req.url;
  const test = dbConfig.username;
  res.send(`
    <html>
      <head>
        <title>Affichage Méthode HTTP</title>
      </head>
      <body>
        <h1>Méthode HTTP : ${method}</h1>
        <h2>MethodURL : ${URL}<h1>
        <h1>MethodDbConfig ${test}<h1>
      </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log("listen on PORT",port);
})
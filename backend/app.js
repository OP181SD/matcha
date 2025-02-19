import express from 'express';
import pg from 'pg'
import { dbConfig, PORT } from './config/import.js';

const {Client} = pg;
const app = express();

const database = new Client(dbConfig);

database.connect()
.then( () => console.log("Connxected to POSTGRE SQL"))
.catch(err => console.error("Coxnnexion error",err))

app.get('/', (req, res) => {
    res.send("Texsxxxt");
  });

app.listen(PORT, () =>{

})
  
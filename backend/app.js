import express from 'express';
import cors from 'cors';
import pg from 'pg';
import { dbConfig, PORT } from './config/import.js';

const { Client } = pg;

const app = express();
app.use(cors());

const client = new Client(dbConfig);

const ConnectToBdd = async () => {
    try {
        await client.connect();
        console.log("Connexion à la base de données réussie");
    } catch (error) {
        console.error("Échec de la connexion à la base de données", error);
        throw error;
    }
};

const GetPage = () => {
    app.get('/', (req, res) => {
        res.send("Connexion réussie");
    });
};

const startServer = async () => {
    try {
        await ConnectToBdd();
        GetPage();
        app.listen(PORT, () => {
            console.log(`Serveur en écoute sur le port ${PORT}`);
        });
    } catch (error) {
        console.error("Le serveur n'a pas pu démarrer en raison d'une erreur de connexion à la base de données.");
    }
};

startServer();

import express from 'express';
import cors from 'cors';
import pg from 'pg';
import { dbConfig, PORT } from './config/import.js';

const { Client } = pg;

const app = express();
app.use(cors());

const client = new Client(dbConfig);

// import.js
import express from "express";
import dotenv from "dotenv";
import pg from "pg";

dotenv.config(); 

export const app = express();
export const PORT = 5001; 
export const { Pool } = pg;

app.use(express.json());

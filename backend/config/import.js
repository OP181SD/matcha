// import.js
import express from "express";
import dotenv from "dotenv";
import pg from "pg";
import bcrypt from "bcrypt";

dotenv.config(); 

export const app = express();
export const PORT = 5001; 
export const { Pool } = pg;
export const bcryptHash = bcrypt.hash;
export const bcryptCompare = bcrypt.compare;


app.use(express.json());

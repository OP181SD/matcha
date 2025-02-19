// backend/config/imports.js

// Configuration de la base de données PostgreSQL
export const dbConfig = {
  
  user: 'user',                 
  host: 'data-base',              
  database: 'matcha_db',         
  password: 'password',           
  port: 5432,                
  };

// Définition du port pour Docker
export const PORT = 5001;
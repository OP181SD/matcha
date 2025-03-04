// src/app.js
import {app, PORT } from '../config/import.js'; 
import '../config/database.js'; 
import { register } from './authControllers/register.js';

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


console.log(register);
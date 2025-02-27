import express from 'express';
import dotenv from 'dotenv';

const app = express();

dotenv.config();
console.log(process.env.POSTGRES_USER);

app.get('/', (req, res) => {
    res.send('Hello World');
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running eeoeeen port ${PORT}`);
});
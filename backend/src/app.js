import {app} from '../config/import.js';

console.log(process.env.POSTGRES_USER)

app.get('/', (req, res) => {
    res.send('Helfelo World');
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Server runwddwfeefning eeoeeen port ${PORT}`);
});
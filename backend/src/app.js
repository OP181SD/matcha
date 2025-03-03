import { register } from '../config/register.js';
import { app, PORT} from '../config/database.js';

app.get('/',(req, res) => {
    res.send("Hello");
})


app.listen(PORT, () => {
    console.log(`Port BINDED ${PORT}`);
});



console.log(register);
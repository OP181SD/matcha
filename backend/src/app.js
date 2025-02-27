import { app, PORT} from '../config/import.js';

app.get('/',(req, res) => {
    res.send("Hello");
})


app.listen(PORT, () => {
    console.log(` dfewd on ${PORT}`);
});




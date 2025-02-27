import { app, pool, PORT} from '../config/import.js';

app.get('/',(req, res) => {
    res.send("Hello");
})


app.listen(PORT, () => {
    console.log(`Server dwwdwddwddwrunning on ${PORT}`);
});

console.log("ARRAY",pool);
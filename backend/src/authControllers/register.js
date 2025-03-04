import { app, bcryptHash } from "../../config/import.js";
import { pool } from "../../config/database.js";

export const register = "On est dans le point d'entrée";

async function createUser(username, email, password) {
    try {
        const request = await pool.query(
            "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)",
            [username, email, password]
        );
        console.log("Utilisateur ajouté", request.rows);
        return request.rows[0];
    } catch (error) {
        console.log("Erreur", error);
    }
}

app.post('/test-post', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashPassword = await getPassword(password);
        const result = await createUser(username, email, hashPassword);
        res.status(200).json({ success: true, message: "Utilisateur ajouté à la base de données", data: result });
    } catch (error) {
        console.log("Erreur", error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});

async function getPassword(password) {
    try {
        const hash = await bcryptHash(password, 10);
        return hash;
    } catch (error) {
        console.log("Erreur", error);
    }
}

// console.log(getPassword("motdepasse").then(console.log));

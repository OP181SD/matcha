import { app,bcryptHash } from "../../config/import.js";


export const register = "on es dans le point dentree";


async function createUser(username, email)
{
    try {
        const request = await pool.query("INSERT INTO users (username, email) VALUES ($1, $2)", [username, email]);
        console.log("Users ajouter");
        return (request);
    } catch (error) {
        console.log("error",error);
    }

}

app.post('/test-post', async (req, res) => {
    try {
        const {username, email} = req.body;
        const result = await createUser(username, email);
        res.status(200).json({success: true, message: "User ajouter a la base de dooner", data: result})
    } catch (error) {
        console.log("error", error);
        res.status(500).json({success: false, message: "Erreur server"});
    }
})


const hashPassword = async(password) =>
{
    const saltRounds = 10;
    return (await bcryptHash(password,saltRounds));
};

hashPassword("monMotDepasse123").then(console.log);
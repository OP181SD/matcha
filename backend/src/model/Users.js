import { bcryptHash } from '../../config/import.js';

const registerUser = async (request, username, email, password) => {

    try {
        const hashedPassword = bcryptHash(password,10);
        const result = await request.pg.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *'
            ,[username, email, hashedPassword]
        );
        return (result.rows);
    } catch (error) {
        throw new Error("Error during registation" + error.message);
    }
}

export { registerUser };
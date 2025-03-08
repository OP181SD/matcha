import { pool } from '../config/database.js';
import { bcryptHash, fastify, PORT } from '../config/import.js';

fastify.get("/", async (request, reply) => {
  return { hello: "yassine" };
});

const register = async (request, reply) => {
  try {

  
    const { username, email, password } = request.body;
    const hashedPassword = await bcryptHash(password,10);


    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
      [username, email, hashedPassword]
    );
    reply.send({ status: 'success', user: result.rows[0] });
  } catch (error) {
    console.error("Error during registration", error);
    reply.status(500).send({ error: "Internal server error" });
  }
};

const start = async () => {
  try {
    console.log("Starting server...");
    await fastify.listen({ port: PORT, host: "0.0.0.0" });
    console.log("✅ Server is running on http://localhost:5001");
  } catch (error) {
    console.error("❌ Error starting server:", error);
    process.exit(1);
  }
};

fastify.post('/register', register);

start();